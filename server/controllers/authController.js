const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Helper function to generate a JWT token
 * @param   {string} id - The MongoDB user/admin ID
 * @param   {string} role - The role of the user ('user' or 'admin')
 * @returns {string} - The signed JWT token
 */
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

// ==========================================
// USER AUTHENTICATION
// ==========================================

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Check if the user email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password before saving (Security Best Practice)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new user record in MongoDB
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    // 4. Generate a JWT token for immediate login
    const token = createToken(user._id, 'user');

    // 5. Send back user data (excluding password) and the token
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: 'user',
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Compare the entered password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Check if the user is currently banned
    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });
    }

    // 4. Generate a new JWT token
    const token = createToken(user._id, 'user');

    // 5. Respond with user details and token
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: 'user',
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

/**
 * @desc    Register a new admin
 * @route   POST /api/auth/admin/register
 * @access  Public (Should be restricted in production)
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // 1. Check if the admin email already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the admin record
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber
    });

    // 4. Generate a JWT token with the 'admin' role
    const token = createToken(admin._id, 'admin');

    res.status(201).json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: 'admin',
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Authenticate an admin & get token
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Check the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate the JWT token
    const token = createToken(admin._id, 'admin');

    res.json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: 'admin',
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
