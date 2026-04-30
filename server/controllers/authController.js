const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const createToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// User Register
exports.userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id, "user");

    res.status(201).json({ message: "User registered successfully", token, user });
  } catch (error) {
    res.status(500).json({ message: "User register failed" });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "User is banned" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id, "user");

    res.json({ message: "User logged in successfully", token, user });
  } catch (error) {
    res.status(500).json({ message: "User login failed" });
  }
};

// Admin Register
exports.adminRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const token = createToken(admin._id, "admin");

    res.status(201).json({ message: "Admin registered successfully", token, admin });
  } catch (error) {
    res.status(500).json({ message: "Admin register failed" });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const token = createToken(admin._id, "admin");

    res.json({ message: "Admin logged in successfully", token, admin });
  } catch (error) {
    res.status(500).json({ message: "Admin login failed" });
  }
};