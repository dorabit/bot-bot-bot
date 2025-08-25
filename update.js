// update.js
import fs from "fs-extra";
import path, { resolve, dirname } from "path";
import axios from "axios";
import { createInterface } from "readline";
import logger from "./core/var/modules/logger.js";

const baseURL = "https://raw.githubusercontent.com/XaviaTeam/XaviaBot/main";
const allVersionsURL = "https://raw.githubusercontent.com/XaviaTeam/XaviaBotUpdate/main/_versions.json";

const checkUpdate = async () => {
  try {
    logger.custom("🔎 Checking for updates...", "UPDATE");
    const { data } = await axios.get(allVersionsURL);
    const currentVersion = (await fs.readJson("./package.json")).version;

    const updateScriptsArr = [];
    const newVersionIndex = Object.entries(data).findIndex(([ver]) => ver === currentVersion);

    if (newVersionIndex !== -1) {
      for (const [, versionAfter] of Object.entries(data).slice(newVersionIndex)) {
        const scriptsURL = `https://raw.githubusercontent.com/XaviaTeam/XaviaBotUpdate/main/_${versionAfter}.json`;
        const scripts = (await axios.get(scriptsURL)).data;
        updateScriptsArr.push(scripts);
      }
    }
    return updateScriptsArr;
  } catch (err) {
    logger.error("❌ Failed to check for updates.");
    logger.error(err);
    process.exit(0);
  }
};

const mergeScripts = (list = []) => {
  const scripts = { changed: [], added: [], removed: [] };

  for (const item of list) {
    for (const type of ["changed", "added", "removed"]) {
      for (const entry of item[type]) {
        if (!scripts[type].includes(entry)) scripts[type].push(entry);

        if (type === "added") {
          scripts.removed = scripts.removed.filter(r => r !== entry);
        }
        if (type === "removed") {
          scripts.added = scripts.added.filter(a => a !== entry);
          scripts.changed = scripts.changed.filter(c => c !== entry);
        }
      }
    }
  }

  for (const key of Object.keys(scripts)) scripts[key] = scripts[key].sort();
  return scripts;
};

const toStringScripts = (scripts) => {
  let text = "";
  for (const [type, list] of Object.entries(scripts)) {
    if (list.length) {
      text += `${type[0].toUpperCase() + type.slice(1)}:\n`;
      list.forEach(item => (text += `- ${item}\n`));
    }
  }
  return text;
};

const backupList = async (lists = []) => {
  try {
    for (const list of lists) {
      for (const item of list) {
        const backupPath = resolve(`./backup/${item.slice(2)}`);
        await fs.ensureDir(dirname(backupPath));

        const filePath = resolve(item);
        if (await fs.pathExists(filePath)) {
          await fs.copy(filePath, backupPath);
        }
      }
    }
    await fs.copy("./package.json", "./backup/package.json");
  } catch (err) {
    logger.error("❌ Failed to backup old files.");
    throw err;
  }
};

const __change__add = async (lists = []) => {
  for (const list of lists) {
    for (const item of list) {
      const filePath = resolve(item);
      await fs.ensureDir(dirname(filePath));

      const url = `${baseURL}/${item.slice(2)}`;
      const { data } = await axios.get(url, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        data.pipe(writer);
        writer.on("finish", () => {
          logger.custom(`✅ Updated ${item}`, "UPDATE");
          resolve();
        });
        writer.on("error", reject);
      });
    }
  }
};

const __remove = async (list = []) => {
  for (const item of list) {
    const filePath = resolve(item);
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      logger.custom(`🗑️ Removed ${item}`, "UPDATE");
    }
  }
};

const restore = async (lists = []) => {
  logger.custom("♻️ Restoring backup...", "UPDATE");
  for (const list of lists) {
    for (const item of list) {
      const backupPath = resolve(`./backup/${item.slice(2)}`);
      if (await fs.pathExists(backupPath)) {
        await fs.copy(backupPath, resolve(item));
      }
    }
  }
};

const update = async (scripts, newPackage) => {
  try {
    const { changed, added, removed } = scripts;
    logger.custom("⚡ Updating Dora Bot...", "UPDATE");

    await fs.ensureDir("./backup");
    await backupList([changed, added, removed]);

    await __change__add([changed, added]);
    await __remove(removed);

    await fs.writeJson("./package.json", newPackage, { spaces: 2 });
    logger.custom("🎉 Update complete!", "UPDATE");
  } catch (err) {
    logger.error("❌ Update failed, restoring backup...");
    await restore([scripts.changed, scripts.added, scripts.removed]);
  }
};

const main = async () => {
  try {
    const updateScriptsArr = await checkUpdate();
    if (!updateScriptsArr.length) {
      logger.custom("✔️ Dora Bot is up-to-date.", "UPDATE");
      process.exit(0);
    }

    const mergedScripts = mergeScripts(updateScriptsArr);
    console.log(toStringScripts(mergedScripts));
    const newPackage = (await axios.get(`${baseURL}/package.json`)).data;

    logger.warn("⚠️ Please check the above changes and backup if necessary.");
    logger.warn("📂 A 'backup' folder will be created automatically.");

    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question("» Do you want to update Dora Bot? (y/n) ", async (answer) => {
      rl.close();
      if (answer.toLowerCase() === "y") {
        await update(mergedScripts, newPackage);
      } else {
        logger.warn("❌ Update canceled.");
      }
    });
  } catch (err) {
    logger.error("❌ An error occurred during update.");
    logger.error(err);
    process.exit(0);
  }
};

main();
