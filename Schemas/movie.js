const mongoose = require("mongoose");

// دالة التحقق من صحة الرابط
function validateURL(value) {
  return /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}\/?([\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(
    value
  );
}

// دالة التحقق من عدد العناصر في المصفوفة
function arrayLimit(val) {
  return val.length > 0;
}

// تعريف مخطط البيانات الخاص بالفيلم
const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    director: { type: String, required: true },
    comment: { type: String, trim: true },
    desc: { type: String, required: true },
    year: { type: Number, required: true, min: 1888 },
    rating: { type: Number, required: true, min: 0, max: 10, default: 0 },
    genre: { type: String, required: true },
    category: { type: [String], required: true },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: { type: String, trim: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    videosURL: {
      type: [String], // ✅ مصفوفة تحتوي على كل روابط الفيديو
      required: true,
      validate: [
        arrayLimit,
        "يجب أن تحتوي مقاطع الفيديو على رابط واحد على الأقل",
      ],
    },

    poster: {
      type: String,
      required: true,
      validate: { validator: validateURL, message: "ليس رابط صورة صالحًا!" },
    },

    images: {
      type: [String],
      validate: [arrayLimit, "يجب أن تحتوي الصور على رابط واحد على الأقل"],
    },
  },
  { timestamps: true }
);

// تصدير النموذج
module.exports = mongoose.model("Movie", MovieSchema);
