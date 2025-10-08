// استيراد مكتبة Express التي تُستخدم لإنشاء الخادم
const express = require("express");

// استيراد دالة connectDB التي تقوم بالاتصال بقاعدة البيانات
const connectDB = require("./config/db");

// استيراد المسارات الخاصة بالأفلام من الملف movieRoutes
const movieRoutes = require("./Routes/movieRoutes");

// استيراد المسارات الخاصة بالمستخدمين من الملف userRoutes
const userRoutes = require("./Routes/userRoutes");

// تحميل ملف البيئة (.env) للحصول على المتغيرات المخزنة مثل رقم المنفذ أو بيانات الاتصال
require("dotenv").config();

// استيراد مكتبة cors لتنشيط CORS
const cors = require("cors");

// إنشاء تطبيق Express جديد
const app = express();

// استخدام مكتبة cors لتنشيط CORS
app.use(cors());

// Deploymant Access & compression data
const compression = require("compression");
app.use(compression());

// الاتصال بقاعدة البيانات
connectDB(); // هنا سيتم استدعاء الدالة connectDB التي تقوم بإعداد الاتصال بقاعدة البيانات الخاصة بالتطبيق

// استخدام Middleware لتحويل البيانات القادمة من العميل إلى JSON
app.use(express.json()); // هذا middleware يقوم بتحويل البيانات المرسلة عبر HTTP body إلى صيغة JSON لسهولة التعامل معها

// توجيه الطلبات التي تبدأ بـ "/api" إلى المسارات الخاصة بالأفلام
app.use("/api", movieRoutes); // أي طلب يحتوي على "/api" في بدايته سيتم تمريره إلى المسارات في movieRoutes

// توجيه الطلبات التي تبدأ بـ "/user" إلى المسارات الخاصة بالأفلام
app.use("/user", userRoutes); // أي طلب يحتوي على "/user" في بدايته سيتم تمريره إلى المسارات في userRoutes

// تحديد المنفذ الذي سيعمل عليه الخادم. إما من ملف البيئة أو 5000 بشكل افتراضي
const PORT = process.env.PORT || 5000; // إذا كان هناك متغير PORT في ملف البيئة، سيتم استخدامه، وإلا سيتم استخدام 5000

// تشغيل الخادم والاستماع على المنفذ المحدد
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // تشغيل الخادم على المنفذ المحدد وعرض رسالة في الكونسول عند بدء التشغيل
