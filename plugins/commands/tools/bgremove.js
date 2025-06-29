import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = './plugins/commands/cache';

const config = {
    name: 'ازالة', 
    version: '1.0.0',
    permissions: 0,
    credits: 'emil',
    description: 'Remove background from image',
    commandCategory: 'image',
    usages: 'reply to image',
    cooldown: 5
};

const langData = {
    "en_US": {
        "notAReply": "Please reply to the image to remove background.",
        "notAPhoto": "This is not a photo.",
        "processingError": "An error occurred while processing the image.",
        "executionError": "An error occurred while executing the command.",
        "successBGRemove": "Background removed successfully ✅"
    },
    "vi_VN": {
        "notAReply": "Vui lòng trả lời hình ảnh để xóa nền.",
        "notAPhoto": "Đây không phải là một bức ảnh.",
        "processingError": "Đã xảy ra lỗi khi xử lý hình ảnh.",
        "executionError": "Đã xảy ra lỗi khi thực thi lệnh.",
        "successBGRemove": "Đã xóa nền thành công ✅"
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
        const apiUrl = `https://rapido.up.railway.app/api/remove-background?imageUrl=${encodeURIComponent(imageUrl)}`;
        
        const response = await axios.get(apiUrl);
        
        if (!response.data || !response.data.result) {
            return message.reply(getLang("processingError"));
        }
        
        const resultUrl = response.data.result;
        const imageResponse = await axios.get(resultUrl, { responseType: 'arraybuffer' });
        
        await fs.ensureDir(cacheDir);
        const filePath = path.join(cacheDir, 'bgremove.png');
        await fs.outputFile(filePath, Buffer.from(imageResponse.data));
        
        await message.reply({
            body: getLang("successBGRemove"),
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
