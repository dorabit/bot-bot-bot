import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { spawn, execSync } from 'child_process';
import semver from 'semver';
import axios from 'axios';

import { } from 'dotenv/config';
import logger from './core/var/modules/logger.js';
import loadPlugins from './core/var/modules/installDep.js';

import environments from './core/var/modules/environments.get.js';

const { isGlitch, isReplit, isGitHub } = environments;

console.clear();

// ✅ تثبيت Node.js 16 في بعض بيئات Replit القديمة
function upNodeReplit() {
    return new Promise(resolve => {
        execSync('npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH');
        resolve();
    })
}

(async () => {
    if (process.version.slice(1).split('.')[0] < 16) {
        if (isReplit) {
            try {
                logger.warn("🔄 جاري تثبيت Node.js v16 لبيئة Replit...");
                await upNodeReplit();
                if (process.version.slice(1).split('.')[0] < 16) throw new Error("فشل تثبيت Node.js v16.");
            } catch (err) {
                logger.error("❌ خطأ أثناء محاولة تثبيت Node.js v16.");
                logger.error(err);
                process.exit(0);
            }
        }
        logger.error("⚠️ بوت Dora يحتاج Node.js v16 أو أحدث. الرجاء التحديث.");
        process.exit(0);
    }

    if (isGlitch) {
        const WATCH_FILE = {
            "restart": {
                "include": [
                    "\\.json"
                ]
            },
            "throttle": 3000
        }

        if (!existsSync(process.cwd() + '/watch.json') || !statSync(process.cwd() + '/watch.json').isFile()) {
            logger.warn("🌐 تم اكتشاف بيئة Glitch. يتم إنشاء ملف watch.json...");
            writeFileSync(process.cwd() + '/watch.json', JSON.stringify(WATCH_FILE, null, 2));
            execSync('refresh');
        }
    }

    if (isGitHub) {
        logger.warn("⚠️ تشغيل البوت على GitHub غير مستحسن.");
    }
})();

// 🟢 التحقق من وجود تحديثات
async function checkUpdate() {
    logger.custom("🔍 جاري التحقق من وجود تحديثات...", "تحديث");
    try {
        const res = await axios.get('https://raw.githubusercontent.com/XaviaTeam/XaviaBot/main/package.json');

        const { version } = res.data;
        const currentVersion = JSON.parse(readFileSync('./package.json')).version;
        if (semver.lt(currentVersion, version)) {
            logger.warn(`📢 إصدار جديد متاح: ${version}`);
            logger.warn(`📌 الإصدار الحالي: ${currentVersion}`);
        } else {
            logger.custom("✅ لا توجد تحديثات متاحة حالياً.", "تحديث");
        }
    } catch (err) {
        logger.error('❌ فشل التحقق من وجود تحديثات.');
    }
}

// Child handler
const _1_MINUTE = 60000;
let restartCount = 0;

async function main() {
    await checkUpdate();
    await loadPlugins();
    const child = spawn('node', ['--trace-warnings', '--experimental-import-meta-resolve', '--expose-gc', 'core/_build.js'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: process.env
    });

    child.on("close", async (code) => {
        handleRestartCount();
        if (code !== 0 && restartCount < 5) {
            console.log();
            logger.error(`❌ حدث خطأ، كود الخروج: ${code}`);
            logger.warn("🔄 جاري إعادة تشغيل البوت...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            main();
        } else {
            console.log();
            logger.error("🛑 توقف بوت Dora. اضغط Ctrl + C للخروج.");
        }
    });
};

function handleRestartCount() {
    restartCount++;
    setTimeout(() => {
        restartCount--;
    }, _1_MINUTE);
}

main();
