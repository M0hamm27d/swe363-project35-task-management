const User = require("../models/User");
const jwt = require("jsonwebtoken");

// register user
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};


// login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "User is banned" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET
    );

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};