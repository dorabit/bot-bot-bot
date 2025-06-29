const axios = require('axios');
const fs = global.client.getFile;
const path = require('path');

const config = {
  name: "تحكم",
  aliases: ["shell"],
  version: "1.0.0",
  description: "أمر shell للتحكم في ملفات البوت",
  usage: "<الأمر>",
  credits: "مطور البوت"
};

async function onCall({ api, event, args }) {
  if (event.senderID !== "61553754531086") {
    return api.sendMessage("ليس لديك الصلاحية لاستخدام هذا الأمر", event.threadID);
  }

  const command = args[0];
  const currentDir = __dirname;

  if (command === "ls") {
    const files = await fs.readdir(currentDir);
    api.sendMessage(files.join("\n"), event.threadID);
  } else if (command === "get") {
    const fileName = args[1];
    const filePath = path.join(currentDir, fileName);
    if (await fs.exists(filePath)) {
      if ((await fs.stat(filePath)).isFile() && /\.(jpg|jpeg|png|gif)$/.test(fileName)) {
        api.sendMessage({ attachment: await fs.createReadStream(filePath) }, event.threadID);
      } else {
        const fileContent = await fs.readFile(filePath, "utf8");
        api.sendMessage(fileContent, event.threadID);
      }
    } else {
      api.sendMessage("الملف غير موجود", event.threadID);
    }
  } else if (command === "del") {
    const fileName = args[1];
    const filePath = path.join(currentDir, fileName);
    if (await fs.exists(filePath)) {
      await fs.unlink(filePath);
      api.sendMessage("تم حذف الملف", event.threadID);
    } else {
      api.sendMessage("الملف غير موجود", event.threadID);
    }
  } else if (command === "mkdir") {
    const dirName = args[1];
    const newDir = path.join(currentDir, dirName);
    if (!await fs.exists(newDir)) {
      await fs.mkdir(newDir);
      api.sendMessage("تم إنشاء المجلد", event.threadID);
    } else {
      api.sendMessage("المجلد موجود بالفعل", event.threadID);
    }
  } else {
    api.sendMessage("الأمر غير مدعوم", event.threadID);
  }
}

export default { config, onCall };
