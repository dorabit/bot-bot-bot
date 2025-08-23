module.exports = {
  config: {
    name: "help",
    aliases: ["h", "اوامر"],
    version: "1.0",
    author: "حمودي سان",
    countDown: 5,
    role: 0,
    shortDescription: "عرض جميع الأوامر",
    longDescription: "إظهار قائمة الأوامر مع الشرح",
    category: "general",
    guide: {
      en: "{p}help [اسم الأمر]"
    }
  },

  onStart: async function ({ message, args, commands, prefix }) {
    if (args[0]) {
      const command = commands.get(args[0].toLowerCase());
      if (!command)
        return message.reply(`❌ ما فيش أمر اسمه: ${args[0]}`);

      const guide = command.config.guide ? command.config.guide.en : "لا يوجد شرح";
      return message.reply(
        `📌 اسم الأمر: ${command.config.name}\n` +
        `🔑 اختصارات: ${command.config.aliases?.join(", ") || "لا يوجد"}\n` +
        `📂 التصنيف: ${command.config.category}\n` +
        `📖 الوصف: ${command.config.longDescription}\n` +
        `📚 الاستعمال: ${guide}`
      );
    }

    let msg = "📜 قائمة الأوامر المتاحة:\n\n";
    const categories = {};

    for (const [name, command] of commands) {
      const cat = command.config.category || "عام";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    for (const cat in categories) {
      msg += `✨ ${cat}:\n${categories[cat].join(", ")}\n\n`;
    }

    msg += `استخدم: ${prefix}help [اسم الأمر] لعرض تفاصيل أكثر.`;
    message.reply(msg);
  }
};
