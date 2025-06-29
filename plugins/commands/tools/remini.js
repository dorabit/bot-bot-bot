import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pogi = './plugins/commands/cache';

const config = {
    name: 'تحسين',
    version: '1.0.0',
    permissions: 0,
    credits: 'emil',
    description: 'enhance photo',
    commandCategory: 'dont know',
    usages: 'reply to image',
    cooldown: 5,
    dependencies: {}
};

const langData = {
    "en_US": {
        "notAReply": "رد على الصورة التي تريد تحسينها.",
        "notAPhoto": "This is not a photo.",
        "processingError": "An error occurred while processing the image.",
        "executionError": "An error occurred while executing the command.",
        "successMessage": "The image has been successfully enhanced ✅"
    },
    "vi_VN": {
        "notAReply": "Vui lòng trả lời hình ảnh để nâng cao chất lượng.",
        "notAPhoto": "Đây không phải là một bức ảnh.",
        "processingError": "Đã xảy ra lỗi khi xử lý hình ảnh.",
        "executionError": "Đã xảy ra lỗi khi thực thi lệnh.",
        "successMessage": "Chất lượng hình ảnh đã được nâng cao thành công ✅"
    }
};

async function onCall({ message, getLang }) {
    if (!message.messageReply || !message.messageReply.attachments || message.messageReply.attachments.length === 0) {
        return message.reply(getLang("notAReply"));
    }
    
    if (message.messageReply.attachments[0].type !== "photo") {
        return message.reply(getLang("notAPhoto"));
    }
    
    try {
        const imageUrl = message.messageReply.attachments[0].url;
        
        const apiResponse = await axios.get('https://rapido.zetsu.xyz/api/upscale-v3?imageUrl=' + encodeURIComponent(imageUrl));
        
        if (!apiResponse.data || !apiResponse.data.resultImageUrl) {
            return message.reply(getLang("processingError"));
        }
        
        const resultUrl = apiResponse.data.resultImageUrl;
        const imageResponse = await axios.get(resultUrl, { responseType: 'arraybuffer' });
        
        await fs.ensureDir(pogi);
        const filePath = path.join(pogi, '4k.png');
        await fs.outputFile(filePath, Buffer.from(imageResponse.data));
        
        await message.reply({
            body: getLang("successMessage"),
            attachment: fs.createReadStream(filePath)
        });
    } catch (error) {
        console.error(error);
        return message.reply(getLang("executionError"));
    }
}

export default {
    config,
    langData,
    onCall
};
