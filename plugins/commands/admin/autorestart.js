import { setTimeout } from 'timers';

const config = {
  name: "autorestart",
  permissions: [2],
  isAbsolute: true
};

async function onLoad({ api, getLang }) {
  setInterval(async () => {
    await api.sendMessage("تمت اعادة تشغيل البوت", "61553754531086");
    global.restart();
  }, 3600000); // 3600000 مللي ثانية = 1 ساعة
}

export default {
  config,
  onLoad
};
