import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = './plugins/commands/cache';

const config = {
    name: 'استعادة',
    version: '1.0.0',
    permissions: 0,
    credits: 'emil',
    description: 'Restore image',
    commandCategory: 'image',
    usages: 'reply to image',
    cooldown: 5
};

const langData = {
    "en_US": {
        "notAReply": "رد على الصورة التي تريد استعادتها.",
        "notAPhoto": "This is not a photo.",
        "processingError": "An error occurred while processing the image.",
        "executionError": "An error occurred while executing the command.",
        "successRestore": "Image restored successfully ✅"
    },
    "vi_VN": {
        "notAReply": "Vui lòng trả lời hình ảnh để khôi phục.",
        "notAPhoto": "Đây không phải là một bức ảnh.",
        "processingError": "Đã xảy ra lỗi khi xử lý hình ảnh.",
        "executionError": "Đã xảy ra lỗi khi thực thi lệnh.",
        "successRestore": "Đã khôi phục ảnh thành công ✅"
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
        const apiUrl = `https://rapido.up.railway.app/api/restore?imageUrl=${encodeURIComponent(imageUrl)}`;
        
        const response = await axios.get(apiUrl);
        
        if (!response.data) {
            return message.reply(getLang("processingError"));
        }
        
        const resultUrl = response.data;
        const imageResponse = await axios.get(resultUrl, { responseType: 'arraybuffer' });
        
        await fs.ensureDir(cacheDir);
        const filePath = path.join(cacheDir, 'restore.png');
        await fs.outputFile(filePath, Buffer.from(imageResponse.data));
        
        await message.reply({
            body: getLang("successRestore"),
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
