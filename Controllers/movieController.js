// استيراد موديل Movie من ملف المخططات (Schemas)
const Movie = require("../Schemas/movie");

// دالة لجلب جميع الأفلام من قاعدة البيانات
exports.getAllmovies = async (req, res) => {
  try {
    // البحث عن جميع الأفلام باستخدام find()
    const movies = await Movie.find();
    // إرسال البيانات كاستجابة بصيغة JSON
    res.json(movies);
  } catch (error) {
    // إرسال رسالة خطأ في حالة حدوث مشكلة في السيرفر
    res.status(500).json({ message: error.message });
  }
};

// دالة لإضافة فيلم جديد إلى قاعدة البيانات
exports.addMovie = async (req, res) => {
  // إنشاء كائن جديد من الموديل Movie باستخدام البيانات القادمة من الطلب
  const newMovie = new Movie(req.body);
  try {
    // حفظ الفيلم الجديد في قاعدة البيانات
    await newMovie.save();
    // إرسال استجابة بنجاح العملية مع كود 201 (Created)
    res.status(201).json(newMovie);
  } catch (error) {
    // إرسال رسالة خطأ في حالة وجود مشكلة في البيانات المرسلة
    res.status(400).json({ message: error.message });
  }
};

// دالة لجلب بيانات فيلم معين من قاعدة البيانات بأستخدام  title
exports.getmovieByName = async (req, res) => {
  try {
    // البحث عن الفيلم باستخدام title
    const movie = await Movie.findOne({ title: req.params.title });
    // إرسال البيانات كاستجابة
    res.json(movie);
  } catch (error) {
    // إرسال رسالة خطاء في حالة حدوث مشكلة في السيرفر
    res.status(500).json({ message: error.message });
  }
};

// دالة لتحديث بيانات فيلم معين
exports.updateMovie = async (req, res) => {
  try {
    // تحديث بيانات الفيلم بحسب ID وإرجاع البيانات الجديدة بعد التحديث
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // تضمن إرجاع البيانات المحدثة بدلاً من القديمة
      }
    );
    // إرسال البيانات المحدثة كاستجابة
    res.json(updatedMovie);
  } catch (error) {
    // إرسال رسالة خطأ في حالة فشل التحديث
    res.status(400).json({ message: error.message });
  }
};

// دالة لحذف فيلم من قاعدة البيانات
exports.deleteMovie = async (req, res) => {
  try {
    // البحث عن الفيلم وحذفه باستخدام ID
    await Movie.findByIdAndDelete(req.params.id);
    // إرسال رسالة تأكيد بنجاح الحذف
    res.json({ message: "Movie deleted" });
  } catch (error) {
    // إرسال رسالة خطأ في حالة فشل عملية الحذف
    res.status(500).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) return res.json([]);
    // console.log("🔍 البحث عن:", query);

    // تحويل البحث إلى Regex بسيط بدون `(?=.*word)`
    const regex = new RegExp(query, "i"); 

    const movies = await Movie.find({
      title: { $regex: regex }, // البحث بكلمة واحدة أو جملة
    })
      .limit(10)
      .select("title poster _id");

    res.json(movies);
  } catch (error) {
    console.error("❌ خطأ في البحث:", error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};
