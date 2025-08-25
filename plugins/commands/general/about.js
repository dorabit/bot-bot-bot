module.exports = {
  config: {
    name: "info",
    aliases: ["معلومات", "about"],
    version: "1.0",
    author: "حمودي سان 🇸🇩",
    role: 0,
    shortDescription: "معلومات عن البوت",
    category: "عام"
  },

  onStart: async function ({ api, event }) {
    api.sendMessage(
`🤖 اسم البوت: Dora
👨‍💻 المطور: حمودي سان 🇸🇩
🔗 فيسبوك: facebook.com/babasnfor80`,
      event.threadID
    );
  }
};
