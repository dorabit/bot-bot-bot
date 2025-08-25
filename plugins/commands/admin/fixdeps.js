import { execSync } from "child_process";
import fs from "fs";

module.exports = {
  config: {
    name: "fixdeps",
    aliases: ["اصلاح_الاعتمادات", "fix"],
    version: "1.0",
    author: "حمودي سان 🇸🇩",
    role: 2, // 2 = فقط الأدمن
    shortDescription: "إصلاح مشاكل الإعتمادات",
    longDescription: "يقوم بحذف node_modules و package-lock.json وإعادة تثبيت الإعتمادات",
    category: "🔧 الإدارة",
    guide: "{p}fixdeps"
  },

  onStart: async function ({ api, event }) {
    api.sendMessage("🔧 جاري إصلاح الإعتمادات... هذا قد يستغرق بعض الوقت ⏳", event.threadID);

    try {
      // 1️⃣ حذف node_modules
      if (fs.existsSync("node_modules")) {
        execSync("rm -rf node_modules");
      }

      // 2️⃣ حذف package-lock.json
      if (fs.existsSync("package-lock.json")) {
        execSync("rm -f package-lock.json");
      }

      // 3️⃣ إعادة تثبيت الإعتمادات
      execSync("npm install", { stdio: "inherit" });

      api.sendMessage("✅ تم إصلاح الإعتمادات بنجاح وإعادة تثبيتها.", event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ حدث خطأ أثناء محاولة إصلاح الإعتمادات. تحقق من الكونسول.", event.threadID);
    }
  }
};
