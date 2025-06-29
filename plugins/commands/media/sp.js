import axios from "axios";

const config = {
  name: "اغنية",
  aliases: ["sp", "music", "song", "sing"],
  description: "",
  usage: "[song name]",
  cooldown: 5,
  permissions: [0],
  credits: "."
};

async function onCall({ message, args }) {
  const query = args.join(" ");
  if (!query) return message.reply("Please provide a song name");

  try {
    const searchResponse = await axios.get(`https://rapido.zetsu.xyz/api/sp?query=${encodeURIComponent(query)}`);
    const track = searchResponse.data;

    if (!track || !track.url) return message.reply("Song not found");

    const downloadUrl = `https://api-spotify-dlr.vercel.app/api?url=${encodeURIComponent(track.url)}`;
    const downloadResponse = await axios.get(downloadUrl, { responseType: 'stream' });

    await message.reply({
      body: `${track.name}`,
      attachment: downloadResponse.data
    });

  } catch (error) {
    console.error(error);
    message.reply(`Error: ${error.message}`);
  }
}

export default {
  config,
  onCall
};
