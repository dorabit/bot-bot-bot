import axios from "axios";

const config = {
  name: "مهمل",
  description: "spam message using ngl username ",
  usage: "username | message | interval | amount",
  cooldown: 5,
  permissions: [0],
  credits: "no credits nigga"
};

async function onCall({ message, args }) {
  const query = args.join(" ");
  if (!query.includes("|")) return message.reply("Usage: اسم المستخدم | الرساله | فاصلة | المبلغ");
  
  const parts = query.split("|").map(s => s.trim());
  if (parts.length < 2) return message.reply("Invalid format. Use: اسم المستخدم | الرساله | فاصلة | المبلغ");

  const username = parts[0];
  const msg = parts[1];
  const interval = parts[2] ? parseInt(parts[2]) : 2000;
  const amount = parts[3] ? parseInt(parts[3]) : 999;

  try {
    message.reply(`Starting NGL spam to ${username}...`);
    
    let count = 0;
    const spamInt = setInterval(async () => {
      if (count >= amount) {
        clearInterval(spamInt);
        message.reply(`✅ Spam complete. Total messages sent: ${count}/${amount}`);
        return;
      }

      const headers = {
        'referer': `https://ngl.link/${username}`,
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      };

      const data = {
        username,
        'question': msg,
        'deviceId': 'ea356443-ab18-4a49-b590-bd8f96b994ee',
        'gameSlug': '',
        'referrer': '',
      };

      try {
        await axios.post('https://ngl.link/api/submit', data, { headers });
        count++;
      } catch (error) {
        message.reply(error);
      }
    }, interval);

  } catch (error) {
    message.reply(error);
  }
}

export default { config, onCall };
