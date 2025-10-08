const express = require("express");
const {
  signup,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getPublicUsers
} = require("./../Controllers/userController");
const fetchUser = require("./../middlewares/authMiddleware"); // تأكد من وجود هذا الملف وتعريفه بالشكل الصحيح

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getuser", fetchUser, getUser);

// Endpoints جديدة لإدارة المستخدمين
router.get("/all", fetchUser, getAllUsers);
router.put("/update/:id", fetchUser, updateUser);
router.delete("/delete/:id", fetchUser, deleteUser);

router.get("/public-users", getPublicUsers); // ✅ مسار عام لجلب بيانات المستخدمين


module.exports = router;
