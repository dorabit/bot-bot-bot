import { execSync } from "child_process";
import lang from "../../../languages/ar.json" assert { type: "json" };
import logger from "./logger.js";

export default async function loadPlugins() {
  try {
    logger.system("🔌 جاري تثبيت الإعتمادات (Dependencies)...");
    execSync("npm install", { stdio: "inherit" });
    logger.success("✅ تم تثبيت جميع الإعتمادات بنجاح.");
  } catch (e) {
    logger.error("❌ فشل تثبيت الإعتمادات.");
    console.error(e);

    // ⛑️ نصائح للمستخدم
    logger.warn("⚠️ قد يكون السبب تلف في مجلد node_modules أو package-lock.json.");
    logger.custom("📌 جرب الحلول التالية:", "مساعدة");
    console.log(`
      1️⃣ احذف مجلد node_modules:
          rm -rf node_modules

      2️⃣ احذف ملف package-lock.json:
          rm -f package-lock.json

      3️⃣ أعد تثبيت الإعتمادات:
          npm install
    `);

    logger.warn("🔁 بعد تطبيق الخطوات أعلاه، أعد تشغيل البوت Dora.");
  }
}
