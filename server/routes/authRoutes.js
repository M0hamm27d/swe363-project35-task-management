const express = require("express");
const router = express.Router();

const {
  userRegister,
  userLogin,
  adminRegister,
  adminLogin,
} = require("../controllers/authController");

router.post("/user/register", userRegister);
router.post("/user/login", userLogin);
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

module.exports = router;