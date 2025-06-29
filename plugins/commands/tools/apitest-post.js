import axios from "axios";

const config = {
  name: "تحليل-بوست",
  aliases: ["testpost", "postapi"],
  description: "Test API endpoints with POST method",
  usage: "[API_URL] | [payload] | [headers]",
  cooldown: 5,
  permissions: [2],
  credits: ".",
};

async function onCall({ message, args }) {
  const input = args.join(" ");
  const [apiUrl, payloadString, headersString] = input.split("|").map(item => item.trim());

  if (!apiUrl) return message.reply("Please provide an API URL");

  let payload = {};
  let headers = {};

  try {
    if (payloadString) payload = JSON.parse(payloadString);
    if (headersString) headers = JSON.parse(headersString);
  } catch (e) {
    return message.reply("Invalid JSON format in payload or headers");
  }

  try {
    const response = await axios.post(apiUrl, payload, {
      responseType: 'stream',
      headers: {
        'Accept': '*/*',
        ...headers
      }
    });

    if (response.headers['content-type']?.includes('application/json')) {
      let data = '';
      response.data.on('data', chunk => data += chunk);
      response.data.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          message.reply(JSON.stringify(jsonData, null, 2));
        } catch (e) {
          message.reply(data);
        }
      });
    } else {
      await message.reply({
        attachment: response.data
      });
    }
  } catch (error) {
    console.error(error);
    message.reply(`Error: ${error.message}`);
  }
}

export default {
  config,
  onCall
};
