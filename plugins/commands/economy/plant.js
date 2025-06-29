import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "نبات",
  aliases: ["grow"],
  description: "Buy and grow plants",
  usage: "<buy/check/sell>",
  cooldown: 9,
  credits: "Ariél Violét (improved by: Rue)"
};

const langData = {
  "ar_SY": {
    "plant.buySuccess": "لقد اشتريت نباتًا بنجاح! 🪴 سينمو نباتك مع مرور الوقت.",
    "plant.buyFailure": "لديك بالفعل نبات.",
    "plant.sellSuccess": "لقد بعت نباتك مقابل ${amount} 💵",
    "plant.noPlant": "ليس لديك نبات. استخدم `plant buy` للحصول على واحد.",
    "plant.growthInfo": "نباتك نما! قيمته الحالية هي ${value} 💵.",
    "plant.checkInfo": "قيمة نباتك هي: ${value}💰\n━━━━━━━━━━━━━━━\nقيمة النمو لكل دورة: +${growthValue}"
  }
};
let plantOwners = new Map();
const GROWTH_INTERVAL = 20 * 60 * 1000; // 20 minutes in milliseconds
const GROWTH_RATE = 0.03; // Adjust the growth rate to a lower value
const PATH = join(global.assetsPath, 'plant_owners.json');

function loadPlantOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    plantOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load plant owners:', err);
  }
}

function savePlantOwners() {
  try {
    const data = JSON.stringify(Array.from(plantOwners));
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save plant owners:', err);
  }
}

function updatePlantGrowth() {
  plantOwners.forEach(async (plant, ownerID) => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - plant.lastUpdated;
    const growthCycles = Math.floor(elapsedTime / GROWTH_INTERVAL);
    
    if (growthCycles > 0) {
      const newPlantValue = Math.floor(plant.value * Math.pow(1 + GROWTH_RATE, growthCycles));
      plant.value = newPlantValue;
      plant.lastUpdated = currentTime;
      savePlantOwners();
      
      const user = await Users.getByID(ownerID);
      const growthMessage = getLang("plant.growthInfo").replace("{value}", newPlantValue);
      user.send(growthMessage);
    }
  });
}

loadPlantOwners();

async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers;

  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;

  updatePlantGrowth();

  if (args.length === 0 || args[0] === "menu") {
    return message.reply({
      body: "𝙿𝚕𝚊𝚗𝚝 / 𝙶𝚛𝚘𝚠𝚝𝚑 𝙶𝚊𝚖𝚎\n\n1. `𝚙𝚕𝚊𝚗𝚝 𝚋𝚞𝚢 <𝚊𝚖𝚘𝚞𝚗𝚝>` » 𝙱𝚞𝚢 𝚊 𝚙𝚕𝚊𝚗𝚝.\n𝟸. `𝚙𝚕𝚊𝚗𝚝 𝚌𝚑𝚎𝚌𝚔` » 𝙲𝚑𝚎𝚌𝚔 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊𝚗𝚝 𝚟𝚊𝚕𝚞𝚎.\n𝟹. `𝚙𝚕𝚊𝚗𝚝 𝚜𝚎𝚕𝚕` » 𝚂𝚎𝚕𝚕 𝚢𝚘𝚞𝚛 𝚙𝚕𝚊nt.",
    });
  }

  // Handle "buy" command
  if (args[0] === "buy") {
    if (plantOwners.has(senderID)) {
      return message.reply(getLang("plant.buyFailure"));
    }

    const plantPrice = parseInt(args[1]);

    if (isNaN(plantPrice) || plantPrice <= 0) {
      return message.reply("Invalid amount. Please provide a valid amount of money to buy a plant.");
    }

    const MAXIMUM_BET = 5000000; // 5 billion

    if (plantPrice > MAXIMUM_BET) {
      return message.reply(`𝚃𝚑𝚎 𝚖𝚊𝚡𝚒𝚖𝚞𝚖 𝚋𝚞𝚢 𝚊 𝚙𝚕𝚊𝚗𝚝 𝚊𝚕𝚕𝚘𝚠𝚎𝚍 𝚒𝚜 ${MAXIMUM_BET} 💵.`);
    }

    const userBalance = await Users.getMoney(senderID);

    if (userBalance < plantPrice) {
      return message.reply("You don't have enough balance to buy a plant.");
    }

    await Users.decreaseMoney(senderID, plantPrice);
    plantOwners.set(senderID, { name: message.senderName, value: plantPrice, lastUpdated: Date.now() });
    savePlantOwners();
    return message.reply(getLang("plant.buySuccess"));
  }

  // Handle "check" command
  if (args[0] === "check") {
    if (!plantOwners.has(senderID)) {
      return message.reply(getLang("plant.noPlant"));
    }

    const plantData = plantOwners.get(senderID);
    const plantValue = plantData.value;
    const growthValue = Math.floor(plantValue * GROWTH_RATE * (15 * 60 * 1000) / GROWTH_INTERVAL); 
    const checkMessage = getLang("plant.checkInfo").replace("{value}", plantValue).replace("{growthValue}", growthValue);
    return message.reply(checkMessage);
  }

  // Handle "sell" command
  if (args[0] === "sell") {
    if (!plantOwners.has(senderID)) {
      return message.reply(getLang("plant.noPlant"));
    }

    const plantValue = plantOwners.get(senderID).value;
    await Users.increaseMoney(senderID, plantValue);
    plantOwners.delete(senderID);
    savePlantOwners();
    return message.reply(getLang("plant.sellSuccess").replace("{amount}", plantValue));
  }
}

export default {
  config,
  langData,
  onCall
};
