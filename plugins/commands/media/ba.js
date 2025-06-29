import axios from 'axios';

const config = {
  name: 'بلو',
  aliases: ["ba"]
};

async function onCall({ message }) {
  try {
    const response = await axios.get("https://rapido.zetsu.xyz/api/ba", {
      responseType: 'stream'
    });
    
    await message.reply({
      attachment: response.data
    });
    
  } catch (error) {
    await message.reply(error);
  }
}

export default {
  config,
  onCall
};
