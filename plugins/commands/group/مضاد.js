const config = {
  name: "مضاد_شتم",
  description: "مضاد شتم",
  usage: "[تشغيل/ايقاف]",
  cooldown: 5,
  permissions: [1],
  credits: "XaviaTeam",
};

const langData = {
  ar_SY: {
    enabled: "تم تشغيل المضاد",
    disabled: "تم إيقاف المضاد",
    notAdmin: "البوت ليس ادمن يرجى رفعه",
    kicked: "تم طرد المستخدم بسبب الشتم",
  },
};

const badWords = ["لوطي", "كسمك", "كس", "كسمكم", "نيك", "قحبة", "قحب", "سب"];

async function onCall({ message, args, getLang, data }) {
  if (!message.isGroup) return;
  const { threadID, senderID, body } = message;
  const threadInfo = data.thread.info;
  const { adminIDs } = threadInfo;

  if (args[0] == "تشغيل") {
    if (!adminIDs.some((e) => e == global.botID)) return message.reply(getLang("notAdmin"));
    global.db.set(`anti_bad_words_${threadID}`, true);
    return message.reply(getLang("enabled"));
  }

  if (args[0] == "ايقاف") {
    global.db.set(`anti_bad_words_${threadID}`, false);
    return message.reply(getLang("disabled"));
  }

  if (global.db.get(`anti_bad_words_${threadID}`)) {
    for (const word of badWords) {
      if (body.includes(word)) {
        try {
          await global.api.removeUserFromGroup(senderID, threadID);
          return message.reply(getLang("kicked"));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}

export default { config, langData, onCall };
