const mongoose = require("mongoose");
const User = require("./Schemas/login"); // تأكد من أن المسار صحيح

// ✅ الاتصال بقاعدة البيانات
mongoose.connect("mongodb+srv://movie:112020@movie.4t7nt.mongodb.net/movies", {
  serverSelectionTimeoutMS: 5000,
});

async function updateUsersComments() {
  try {
    const result = await User.updateMany(
      { comment: { $exists: true, $not: { $type: "array" } } }, // البحث عن المستخدمين الذين لديهم تعليق كنص
      [
        {
          $set: {
            comments: {
              $cond: {
                if: { $eq: ["$comment", null] },
                then: [], // إذا لم يكن هناك تعليق، نضع مصفوفة فارغة
                else: [{ text: "$comment", date: new Date() }], // تحويل التعليق إلى كائن يحتوي على نص + تاريخ
              },
            },
          },
        },
        { $unset: "comment" }, // إزالة الحقل القديم
      ]
    );

    console.log(
      `✅ تم تحويل ${result.modifiedCount} من التعليقات إلى مصفوفات تحتوي على تاريخ!`
    );
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ حدث خطأ أثناء التحديث:", error);
    mongoose.connection.close();
  }
}

// ✅ تشغيل الدالة
updateUsersComments();
