import axios from "axios";

const config = {
  name: "صوت_الزكاء",
  aliases: ["talk-audio", "openai"],
  description: "n",
  usage: "[query]",
  cooldown: 5,
  permissions: [0],
  credits: "wala.",
};

async function onCall({ message, args }) {
  const prompt = args.join(" ") || "hi";
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-audio&voice=ash`;

  try {
    const response = await axios.get(url, { responseType: "stream" });
    await message.reply({
      body: "",
      attachment: response.data
    });
  } catch (error) {
    console.error(error);
    await message.reply("An error occurred while fetching data.");
  }
}

export default {
  config,
  onCall,
};
