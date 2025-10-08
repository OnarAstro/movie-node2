// استيراد مكتبة Express لإنشاء الراوتر
const express = require("express");

// استيراد الدوال المطلوبة من وحدة التحكم بالأفلام (Controllers)
const {
  getAllmovies,
  getmovieByName,
  addMovie,
  updateMovie,
  deleteMovie,
  search,
} = require("../Controllers/movieController");

// إنشاء كائن راوتر باستخدام Express
const router = express.Router();

// تعريف مسار للحصول على جميع الأفلام باستخدام دالة getAllmovies
router.get("/movies", getAllmovies);

// تعريف مسار لإضافة فيلم جديد باستخدام دالة addMovie
router.post("/movies", addMovie);

// تعريف المسارات الأخرى (معلّقة حاليًا)

// تعريف مسار لجلب بيانات فيلم معين باستخدام دالة getmovieByName
router.get("/movies/:title", getmovieByName);

// تعريف مسار لتحديث بيانات فيلم معين باستخدام دالة updateMovie
router.put("/movies/:id", updateMovie);

// تعريف مسار لحذف فيلم معين باستخدام دالة deleteMovie
router.delete("/movies/:id", deleteMovie);


// search route

router.get("/search", search);

// تصدير الراوتر ليتم استخدامه في التطبيق الرئيسي
module.exports = router;
