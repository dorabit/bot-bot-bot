import axios from "axios";

const config = {
  name: "خطوط",
  description: "generate stylized text",
  usage: "text | style",
  cooldown: 3,
  permissions: [0],
  credits: "@jm"
};

const available_styles = [
  "bold",
  "tiny",
  "typewriter",
  "bubbles",
  "inverted",
  "strikethrough",
  "symbols",
  "wide",
  "sans",
  "sansBold",
  "sansItalic",
  "sansBoldItalic",
  "script",
  "scriptBold",
  "fraktur",
  "frakturBold",
  "monospace",
  "double",
  "comicBold",
  "smallCaps",
  "medieval",
  "circled",
  "squared",
  "outlined",
  "serif",
  "serifBold",
  "serifItalic",
  "serifBoldItalic",
  "cursive",
  "cursiveBold",
  "cursiveItalic",
  "cursiveBoldItalic",
  "blackboard",
  "blackboardBold",
  "blackboardItalic",
  "blackboardBoldItalic",
  "gothic",
  "gothicBold",
  "gothicItalic",
  "gothicBoldItalic"
];

async function onCall({ message, args }) {
  try {
    const input = args.join(" ");
    const [text, style] = input.split("|").map(item => item.trim());

    if (!text) return message.reply("Please enter text to convert");
    if (!style) return message.reply(`Please specify a style\nAvailable styles: ${available_styles.join(", ")}`);
    if (!available_styles.includes(style)) return message.reply(`Invalid style\nAvailable styles: ${available_styles.join(", ")}`);

    const response = await axios.get(`https://rapido.onlitegix.com/api/font?style=${style}&text=${encodeURIComponent(text)}`);
    
    if (!response.data) return message.reply("Failed to generate text");
    
    await message.reply(response.data.result);
    
  } catch (error) {
    console.error(error);
    message.reply("Error occurred while generating text");
  }
}

export default {
  config,
  onCall
};
