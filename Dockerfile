# bashCopy code
# FROM node:18
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 5000
# CMD ["node", "server.js"]


# استخدام نفس إصدار Node الموجود محليًا لتفادي مشاكل التوافق
FROM node:22-bullseye

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات package.json و package-lock.json أولاً (لتقليل زمن الـ build)
COPY package*.json ./

# تثبيت التبعيات
# نستخدم npm ci لو الملف package-lock.json موجود لأنه أسرع وأكثر استقرارًا
RUN npm ci --omit=dev || npm install --omit=dev

# نسخ باقي ملفات المشروع بعد تثبيت التبعيات
COPY . .

# تعيين بيئة التشغيل للإنتاج (يؤدي إلى تحسين الأداء في بعض المكتبات)
ENV NODE_ENV=production

# فتح المنفذ الذي يستخدمه التطبيق
EXPOSE 5000

# تشغيل التطبيق باستخدام node (بدلاً من nodemon)
CMD ["node", "server.js"]
