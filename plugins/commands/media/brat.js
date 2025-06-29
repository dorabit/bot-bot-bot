import axios from 'axios';

const config = {
    name: 'طفل',
    aliases: [],
    version: '1.0',
    permissions: [0],
    credits: 'rapido',
    description: 'create brat image or video',
    commandCategory: 'fun',
    usages: '[text] | [video/image]',
    cooldown: 5
};

const lang = {
    "en_US": {
        "noText": "ادخل نصا.\n\nexample: مرحبا بالطفل المدلل  | video/image",
        "invalidOption": "اختار صورة او فيديو",
        "error": "An error occurred."
    }
};

async function onCall({ message, args, getLang }) {
    const input = args.join(' ');
    const [text, option] = input.split('|').map(item => item.trim());
    
    if (!text) return message.reply(getLang("noText"));
    if (!option || !['video', 'image'].includes(option.toLowerCase())) return message.reply(getLang("invalidOption"));

    try {
        let apiUrl;
        if (option.toLowerCase() === 'video') {
            apiUrl = `https://api.ferdev.my.id/maker/bratvid?text=${encodeURIComponent(text)}`;
        } else {
            apiUrl = `https://api.zetsu.xyz/gen/brat?text=${encodeURIComponent(text)}&apikey=e1cd2b78cc30d7e2eccfe482f56bcdd5`;
        }

        const res = await axios.get(apiUrl, { responseType: 'stream' });
        
        message.reply({
            body: '',
            attachment: res.data
        });
    } catch (error) {
      console.error(error.message);
        message.reply(getLang("error"));
    }
}

export default {
    config,
    langData: lang,
    onCall
};
