import axios from "axios";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const getStreamFromURL = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stream from URL`, error);
    throw error;
  }
};

export const config = {
  name: "جبلي",
  version: "1.0",
  credits: "Duke Agustin",
  cooldown: 20,
  role: 0,
  description: "Transform image into Ghibli-style",
  longDescription: {
    en: "Reply to an image to transform it into Studio Ghibli style using AI.",
  },
  category: "media",
  usage: "<reply to image>",
};

export const onCall = async ({ message }) => {
  const { messageReply } = message;

  if (
    message.type !== "message_reply" ||
    !messageReply.attachments ||
    messageReply.attachments.length === 0
  ) {
    return message.reply("Please reply to an image to use this command.");
  }

  const attachment = messageReply.attachments[0];
  const fileUrl = attachment.url;

  try {
    await message.reply("Generating Ghibli-style image...");

    const ghibliRes = await axios.get(`https://api.zetsu.xyz/api/ghibli-img`, {
      params: {
        url: fileUrl,
        apikey: "e1cd2b78cc30d7e2eccfe482f56bcdd5"
      }
    });

    const ghibliImageUrl = ghibliRes.data?.result?.url;

    if (!ghibliImageUrl) {
      return message.reply("Failed to get Ghibli image from API.");
    }

    const stream = await getStreamFromURL(ghibliImageUrl);

    return message.reply({
      body: "Ghibli-style image!",
      attachment: stream,
    });

  } catch (err) {
    console.error(err);
    return message.reply("An error occurred while processing your request.");
  }
};
