import axios from 'axios';

const config = {
    name: 'اسكرين',
    aliases: ["ss"],
    version: '1.0',
    permissions: [2],
    credits: 'emil',
    description: 'take screenshot of url',
    commandCategory: 'utility',
    usages: '[url]',
    cooldown: 5
};

const lang = {
    "en_US": {
        "noUrl": "هات رابط الموقع",
        "error": "error"
    },
    "vi_VN": {
        "noUrl": "nhập url",
        "error": "lỗi"
    }
};

async function onCall({ message, args, getLang }) {
    const url = args[0];
    if (!url) return message.reply(getLang("noUrl"));

    try {
        const api = `https://rapido.zetsu.xyz/api/screenshot?url=${encodeURIComponent(url)}`;
        const res = await axios.get(api, { responseType: 'stream' });
        
        message.reply({
            body: '',
            attachment: res.data
        });
    } catch {
        message.reply(getLang("error"));
    }
}

export default {
    config,
    langData: lang,
    onCall
};
