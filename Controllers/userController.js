const User = require("./../Schemas/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// تسجيل مستخدم جديد
exports.signup = async (req, res) => {
  let existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10); // 🔐 تشفير كلمة المرور
  const role = req.body.role || "user"; // تعيين دور المستخدم الافتراضي
  const photo = req.body.photo || "https://images.unsplash.com/photo-1706694668159-42105c6c99c9?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // ✅ صورة افتراضية

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    comment: "",
    role, // حفظ الدور
    photo, // ✅ إضافة الصورة
  });

  await user.save();
  const token = jwt.sign(
    { user: { id: user.id, role: user.role } },
    "secret_ecom"
  );
  res.json({ success: true, token });
};

// تسجيل دخول المستخدم
// exports.login = async (req, res) => {
//   let user = await User.findOne({ email: req.body.email });
//   if (!user || user.password !== req.body.password) {
//     return res.json({ success: false, error: "Invalid email or password" });
//   }

//   const token = jwt.sign(
//     { user: { id: user.id, role: user.role } },
//     "secret_ecom"
//   );
//   res.json({ success: true, token });
// };

// تسجيل دخول المستخدم
exports.login = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.json({ success: false, error: "Invalid email or password" });
  }

  const token = jwt.sign({ user: { id: user.id, role: user.role } }, "secret_ecom");
  res.json({ success: true, token });
};

// الحصول على بيانات المستخدم الحالي
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// عرض جميع المستخدمين (للأدمن فقط) بدون إرجاع كلمة المرور
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    res.json({
      success: true,
      user: { // ✅ تأكد من إرجاع بيانات المستخدم داخل كائن `user`
        _id: user._id,
        name: user.name,
        email: user.email,
        comment: user.comment,
        photo: user.photo?.trim() ? user.photo : "https://images.unsplash.com/photo-1706694668159-42105c6c99c9?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// عرض جميع المستخدمين (متاح فقط للأدمن)
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const users = await User.find({});
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// تعديل بيانات المستخدم
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // السماح للمستخدم العادي بتعديل بياناته فقط
    if (user.role !== "admin" && req.params.id !== req.user.id) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// حذف المستخدم (متاح فقط للأدمن)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getPublicUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name photo comment"); // ✅ جلب الحقول المطلوبة فقط
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};




// const User = require("./../Schemas/login");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// // تسجيل مستخدم جديد
// exports.signup = async (req, res) => {
//   try {
//     let existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10); // 🔐 تشفير كلمة المرور
//     const role = req.body.role || "user";
//     const photo =
//       req.body.photo ||
//       "https://images.unsplash.com/photo-1706694668159-42105c6c99c9?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

//     const user = new User({
//       name: req.body.username,
//       email: req.body.email,
//       password: hashedPassword, // 🔐 تخزين كلمة المرور المشفرة
//       comment: "",
//       role,
//       photo,
//     });

//     await user.save();
//     const token = jwt.sign({ id: user.id, role: user.role }, "secret_ecom", {
//       expiresIn: "7d",
//     });

//     res.json({ success: true, token });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // تسجيل دخول المستخدم
// exports.login = async (req, res) => {
//   try {
//     console.log("🔹 Login Request Body:", req.body); // ✅ عرض البيانات المستلمة من الـ Frontend

//     let user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       console.log("❌ User not found in database");
//       return res.status(401).json({ success: false, error: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       console.log("❌ Password mismatch");
//       return res.status(401).json({ success: false, error: "Invalid email or password" });
//     }

//     console.log("✅ Login successful for:", user.email);

//     const token = jwt.sign({ id: user.id, role: user.role }, "secret_ecom", {
//       expiresIn: "7d",
//     });

//     res.json({ success: true, token });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };


// // جلب بيانات المستخدم
// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password"); // 🚫 استبعاد كلمة المرور
//     if (!user)
//       return res.status(404).json({ success: false, error: "User not found" });

//     res.json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // جلب جميع المستخدمين (متاح فقط للأدمن)
// exports.getAllUsers = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (user.role !== "admin") {
//       return res.status(403).json({ success: false, error: "Unauthorized" });
//     }

//     const users = await User.find({}).select("-password"); // 🚫 عدم إرجاع كلمات المرور
//     res.json({ success: true, users });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // تحديث بيانات المستخدم
// exports.updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user)
//       return res.status(404).json({ success: false, error: "User not found" });

//     // السماح فقط للمستخدم العادي بتعديل بياناته، والأدمن بتعديل الآخرين
//     if (user.role !== "admin" && req.user.id !== req.params.id) {
//       return res.status(403).json({ success: false, error: "Unauthorized" });
//     }

//     if (req.body.password) {
//       req.body.password = await bcrypt.hash(req.body.password, 10); // 🔐 تشفير كلمة المرور الجديدة
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     }).select("-password");
//     res.json({ success: true, user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // حذف المستخدم (متاح فقط للأدمن)
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (user.role !== "admin") {
//       return res.status(403).json({ success: false, error: "Unauthorized" });
//     }

//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser)
//       return res.status(404).json({ success: false, error: "User not found" });

//     res.json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };


// exports.getPublicUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, "name photo comment"); // ✅ جلب الحقول المطلوبة فقط
//     res.json({ success: true, users });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };
