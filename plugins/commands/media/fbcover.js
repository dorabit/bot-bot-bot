import axios from "axios";

const config = {
  name: "غلاف", 
  description: "generate fb cover image",
  usage: "name | subname | sdt | address | email | color",
  cooldown: 5,
  permissions: [0],
  credits: "@jm"
};

async function onCall({ message, args }) {
  const apikey= 'e1cd2b78cc30d7e2eccfe482f56bcdd5';
  const input = args.join(" ");
  const [name, subname, sdt, address, email, color] = input.split("|").map(item => item.trim());
  const uid = message.senderID;

  if (!name || !subname || !email) {
    return message.reply(`Usage: ${config.usage}`);
  }

  const url = `https://api.zetsu.xyz/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(sdt || "n/a")}&address=${encodeURIComponent(address || "n/a")}&email=${encodeURIComponent(email)}&uid=${uid}&color=${encodeURIComponent(color || "red")}&apikey=${apikey}`;

  try {
    const response = await axios.get(url, { responseType: "stream" });
    await message.reply({
      body: "",
      attachment: response.data
    });
  } catch (error) {
    console.error(error);
    await message.reply("Error generating cover image");
  }
}

export default {
  config,
  onCall
};
