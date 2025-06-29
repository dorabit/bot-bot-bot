import axios from "axios";
const config = {
  name: "ديبسكو",
  aliases: [],
  description: "",
  usage: "[query]",
  cooldown: 5,
  permissions: [0],
  credits: "no credits",
};
async function onCall({ message, args }) {
  const query = args.join(" ") || "hi"; 
  const { senderID } = message;
  const apiUrl = `https://zaikyoov3-up.up.railway.app/api/deepseek?prompt=${encodeURIComponent(query)}&uid=${message.senderID}`;
  try {
    const response = await axios.get(apiUrl);
    
    if (response.data) {
      const dot = response.data.reply;
      await message.reply(dot);
    } else {
      await message.reply("No response from the API.");
    }
  } catch (error) {
    await message.reply(error);
  }
}
export default {
  config,
  onCall
};
