const fs = require('fs');
const path = require('path');
let currentDir = __dirname;

module.exports.config = {
  name: "شيل",
  version: "1.0",
  permissions: [2],
  credits: "مطور البوت",
  description: "أمر shell للتحكم في ملفات البوت",
  commandCategory: "آۆآمـر آلُـمطُـۆر",
  usages: "shell [الأمر]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const command = args[0];
  if (command === "ls") {
    const files = fs.readdirSync(currentDir);
    api.sendMessage(files.join("\n"), event.threadID, event.messageID);
  } else if (command === "get") {
    const fileName = args[1];
    const filePath = path.join(currentDir, fileName);
    if (fs.existsSync(filePath)) {
      if (fs.lstatSync(filePath).isFile() && /\.(jpg|jpeg|png|gif)$/.test(fileName)) {
        api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);
      } else {
        const fileContent = fs.readFileSync(filePath, "utf8");
        api.sendMessage(fileContent, event.threadID, event.messageID);
      }
    } else {
      api.sendMessage("الملف غير موجود", event.threadID, event.messageID);
    }
  } else if (command === "del") {
    const fileName = args[1];
    const filePath = path.join(currentDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      api.sendMessage("تم حذف الملف", event.threadID, event.messageID);
    } else {
      api.sendMessage("الملف غير موجود", event.threadID, event.messageID);
    }
  } else if (command === "mkdir") {
    const dirName = args[1];
    const newDir = path.join(currentDir, dirName);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
      api.sendMessage("تم إنشاء المجلد", event.threadID, event.messageID);
    } else {
      api.sendMessage("المجلد موجود بالفعل", event.threadID, event.messageID);
    }
  } else if (command === "rename") {
    const oldName = args[1];
    const newName = args[2];
    const oldPath = path.join(currentDir, oldName);
    const newPath = path.join(currentDir, newName);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      api.sendMessage("تم إعادة تسمية الملف", event.threadID, event.messageID);
    } else {
      api.sendMessage("الملف غير موجود", event.threadID, event.messageID);
    }
  } else if (command === "write") {
    const fileName = args[1];
    const fileContent = args.slice(2).join(" ");
    const filePath = path.join(currentDir, fileName);
    fs.writeFileSync(filePath, fileContent);
    api.sendMessage("تم كتابة الملف", event.threadID, event.messageID);
  } else if (command === "cr") {
    const fileName = args[1];
    const fileContent = args.slice(2).join(" ");
    const filePath = path.join(currentDir, fileName);
    fs.writeFileSync(filePath, fileContent);
    api.sendMessage(`تم إنشاء الملف ${fileName} بنجاح`, event.threadID, event.messageID);
  } else if (command === "cd") {
    const dirName = args[1];
    if (dirName === "..") {
      currentDir = path.dirname(currentDir);
      api.sendMessage(`تم تغيير المجلد إلى ${currentDir}`, event.threadID, event.messageID);
    } else {
      const newDir = path.join(currentDir, dirName);
      if (fs.existsSync(newDir) && fs.lstatSync(newDir).isDirectory()) {
        currentDir = newDir;
        api.sendMessage(`تم تغيير المجلد إلى ${currentDir}`, event.threadID, event.messageID);
      } else {
        api.sendMessage("المجلد غير موجود", event.thread
