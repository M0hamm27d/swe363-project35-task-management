const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

/**
 * @desc    Middleware to protect routes - ensures user is logged in
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user/admin and their role to the request object
      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
        if (req.user) req.user.role = 'admin'; // "Stamp" the role
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (req.user) {
          req.user.role = 'user'; // "Stamp" the role
          if (req.user.isBanned) {
            return res.status(403).json({ message: 'User is banned. Access denied.' });
          }
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 4. Handle Maintenance Mode
      const GlobalSettings = require('../models/GlobalSettings');
      const settings = await GlobalSettings.findOne();
      
      if (settings && settings.maintenanceMode && req.user.role !== 'admin') {
        return res.status(503).json({ message: 'System is currently under maintenance. Please try again later.' });
      }

      // 5. Track Daily Activity (Only for regular users)
      if (req.user.role === 'user') {
        const now = new Date();
        const lastActive = new Date(req.user.lastActiveAt || now);
        
        // Is it a new day?
        const isNewDay = now.toDateString() !== lastActive.toDateString();
        
        if (isNewDay) {
          req.user.dailyUsageMinutes = 0;
        } else {
          // Calculate difference in minutes since last activity
          // We limit the increment to prevent "gaming" the system (max 5 min per request interval)
          const diffMs = now - lastActive;
          const diffMins = Math.min(Math.floor(diffMs / 60000), 5); 
          if (diffMins > 0) {
            req.user.dailyUsageMinutes += diffMins;
          }
        }
        
        req.user.lastActiveAt = now;
        // Save the updated usage data in the background
        await User.findByIdAndUpdate(req.user._id, {
          dailyUsageMinutes: req.user.dailyUsageMinutes,
          lastActiveAt: req.user.lastActiveAt
        });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * @desc    Middleware to restrict access to Admins only
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

/**
 * @desc    Middleware to restrict access to regular Users only
 */
const userOnly = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. User role required.' });
  }
};

module.exports = { protect, adminOnly, userOnly };
