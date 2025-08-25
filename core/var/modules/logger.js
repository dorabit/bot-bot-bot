import chalk from "chalk";
import lang from "../../../languages/ar.json" assert { type: "json" };

function time() {
  return chalk.gray(`[${new Date().toLocaleTimeString("ar-EG")}]`);
}

export default {
  system: (msg) => console.log(time(), chalk.cyan("SYSTEM:"), msg),
  warn: (msg) => console.log(time(), chalk.yellow("تحذير:"), msg),
  error: (msg) => console.log(time(), chalk.red("خطأ:"), msg),
  success: (msg) => console.log(time(), chalk.green("نجاح:"), msg),
  custom: (msg, type = "مخصص") => console.log(time(), chalk.magenta(`${type}:`), msg),

  // ✅ أمثلة باستعمال ملف اللغة
  nodeOld: () => console.log(time(), chalk.red(lang.node.oldVersion)),
  nodeInstalling: () => console.log(time(), chalk.yellow(lang.node.installing)),
  nodeInstallFailed: () => console.log(time(), chalk.red(lang.node.installFailed)),

  updateCheck: () => console.log(time(), chalk.cyan(lang.update.checking)),
  updateNone: () => console.log(time(), chalk.green(lang.update.none)),
  updateNew: (v) => console.log(time(), chalk.yellow(lang.update.newVersion.replace("{version}", v))),
  updateCurrent: (v) => console.log(time(), chalk.gray(lang.update.currentVersion.replace("{current}", v)))
};
