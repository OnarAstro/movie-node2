const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
  // الحصول على التوكن من الـ headers
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Please authenticate using a valid login" });
  }

  try {
    // التحقق من صحة التوكن
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user; // تخزين بيانات المستخدم في الطلب
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
