module.exports = {
  config: {
    name: "help",
    aliases: ["الاوامر", "مساعدة"],
    version: "1.0",
    author: "حمودي سان 🇸🇩",
    role: 0,
    shortDescription: "عرض قائمة الأوامر",
    longDescription: "إظهار جميع الأوامر المتاحة في البوت Dora",
    category: "عام",
    guide: "{p}help"
  },

  onStart: async function ({ api, event }) {
    api.sendMessage(
`📝 قائمة أوامر Dora:

• !نكتة — يرسل لك نكتة عشوائية 😂
• !سؤال — لعبة أسئلة وأجوبة ❓
• !صورة — يرسل صورة عشوائية 🖼️
• !معلومات — حول البوت 👩‍💻

— مع تحيات حمودي سان 🇸🇩`,
      event.threadID
    );
  }
};
