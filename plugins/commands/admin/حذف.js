const fs = require('fs');
const path = require('path');

const config = {
  name: "حذف-امر",
  aliases: ["deletecmd"],
  version: "1.0.0",
  description: "حذف أمر من البوت",
  usage: "<اسم الامر.js> <الفئة>",
  credits: "XaviaTeam"
};

async function onCall({ message, args }) {
  if (message.senderID !== "61553754531086") {
    return message.reply("ليس لديك الصلاحية لاستخدام هذا الأمر");
  }

  if (args.length < 2) {
    return message.reply("الاستخدام: حذف امر <اسم الامر.js> <الفئة>");
  }

  const fileName = args[0];
  const category = args[1];

  const commandsPath = path.join(__dirname, 'plugins', 'commands');
  const categoryPath = path.join(commandsPath, category);
  const filePath = path.join(categoryPath, fileName);

  if (!fs.existsSync(categoryPath)) {
    return message.reply(`لم يتم العثور على الفئة ${category}`);
  }

  if (!fs.existsSync(filePath)) {
    return message.reply(`لم يتم العثور على الأمر ${fileName} في الفئة ${category}`);
  }

  try {
    fs.unlinkSync(filePath);
    message.reply(`تم حذف الأمر ${fileName} من الفئة ${category}`);
  } catch (error) {
    message.reply(`حدث خطأ أثناء حذف الأمر: ${error.message}`);
  }
}

export default { config, onCall };

