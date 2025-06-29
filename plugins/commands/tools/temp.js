import axios from 'axios';

const config = {
  name: "بريد",
  aliases: ["temp"],
  credits: "jm",
  description: "Get temporary email or check inbox",
  cooldown: 5,
  usage: "[gen | inbox <email>]"
};

async function onCall({ message, args }) {
  try {
    const action = args[0]?.toLowerCase();

    if (!action || action === "gen") {
      const { data } = await axios.get("https://rapido.zetsu.xyz/api/tempmail/gen");
      if (!data?.email) return message.reply("❌ Failed to generate email");
      message.reply(`📧 Email: ${data.email}\n⏳ Expires in 10 minutes`);
    }
    else if (action === "inbox") {
      if (!args[1]) return message.reply("Please provide an email");
      
      const email = args[1].trim();
      const { data } = await axios.get(`https://rapido.zetsu.xyz/api/tempmail/inbox?email=${encodeURIComponent(email)}`);
      
      if (!data) return message.reply("📭 Inbox empty");

      const emails = Object.values(data).filter(msg => msg.to === email);
      if (!emails.length) return message.reply("📭 No emails found");

      const replyMsg = emails.map(e => 
        `📨 From: ${e.from}\n📌 Subject: ${e.subject || "None"}\n📝 Message: ${e.body_text || ""}`
      ).join("\n\n");

      message.reply(replyMsg);
    }
    else {
      message.reply("❌ Usage:\n• tempmail gen\n• tempmail inbox <email>");
    }
  } catch (error) {
    message.reply(`❌ Error: ${error.message}`);
  }
}

export default { config, onCall };
