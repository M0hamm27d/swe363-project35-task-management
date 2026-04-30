const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// login admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET
    );

    res.json({ token, admin });

  } catch (err) {
    res.status(500).json({ message: "Error logging in admin" });
  }
};