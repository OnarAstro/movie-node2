// استيراد مكتبة Mongoose للتعامل مع قاعدة بيانات MongoDB
const mongoose = require('mongoose');

// تحميل متغيرات البيئة من ملف .env للسماح باستخدام البيانات الحساسة مثل رابط قاعدة البيانات
require('dotenv').config();

// دالة غير متزامنة (async) لإنشاء اتصال بقاعدة بيانات MongoDB
const connectDB = async () => {
  try {
    // محاولة الاتصال بقاعدة البيانات باستخدام الرابط المخزن في متغير البيئة MONGO_URI
    await mongoose.connect(process.env.MONGO_URI);
    // طباعة رسالة في حالة نجاح الاتصال
    console.log('MongoDB Connected...');
  } catch (err) {
    // في حالة حدوث خطأ أثناء الاتصال، يتم طباعة الخطأ
    console.error(err.message);
    
    // إنهاء العملية مع إرجاع كود خطأ يدل على الفشل
    process.exit(1);
  }
};

// تصدير الدالة لتكون متاحة للاستخدام في أجزاء أخرى من التطبيق
module.exports = connectDB;
