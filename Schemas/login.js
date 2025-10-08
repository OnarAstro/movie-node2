// استيراد مكتبة Mongoose للتفاعل مع قاعدة بيانات MongoDB
const mongoose = require("mongoose");

// تعريف مخطط البيانات الخاص بالفيلم
const UserSchema = new mongoose.Schema(
  {
    // حقل اسم المستخدم
    name: {
      type: String, // نوع البيانات: سلسلة نصية (String)
      required: true, // هذا الحقل إلزامي
      // trim: true, // إزالة الفراغات الزائدة من بداية ونهاية النص
      min: 3, // الاسم يجب ان يكون على الاقل 3 حروف
      max: 20, // الاسم يجب ان يكون على الاكثر 20 حرف
    },
    // حقل كلمة المرور
    password: {
      type: String, // نوع البيانات: سلسلة نصية (String)
      required: true, // هذا الحقل إلزامي
      min: 6, // كلمة المرور يجب ان تكون على الاقل 6 حروف
      max: 20, // كلمة المرور يجب ان تكون على الاكثر 20 حرف
    },
    // حقل الايميل
    email: {
      type: String, // نوع البيانات: سلسلة نصية (String)
      required: true, // هذا الحقل إلزامي
      unique: true, // يجب ان يكون الايميل فريد
    },
    date: {type: Date, default: Date.now},
    comment: { type: String, default: "" }, 
    role: { type: String, default: "user" }, // الافتراضي يكون "user"
    // حقل صورة البوستر
    photo: {
      type: String,
      // default: "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg",
      default: "https://images.unsplash.com/photo-1706694668159-42105c6c99c9",
    },
  },
  { timestamps: true }
); // إضافة timestamps لحقلي createdAt و updatedAt

// تصدير النموذج (model) ليتم استخدامه في باقي التطبيق
module.exports = mongoose.model("User", UserSchema);
