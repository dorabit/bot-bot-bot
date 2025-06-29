import axios from 'axios';

const config = {
    name: 'رفع',
    version: '1.0.0',
    permissions: 0,
    credits: 'emil',
    description: 'Upload image to Imgur',
    commandCategory: 'image',
    usages: 'reply to image',
    cooldown: 5
};

const langData = {
    "en_US": {
        "notAReply": "رد على الصورة التي تريد رفعها.",
        "notAPhoto": "This is not a photo.",
        "processingError": "An error occurred while processing the image.",
        "executionError": "An error occurred while executing the command."
    },
    "vi_VN": {
        "notAReply": "Vui lòng trả lời hình ảnh để tải lên.",
        "notAPhoto": "Đây không phải là một bức ảnh.",
        "processingError": "Đã xảy ra lỗi khi xử lý hình ảnh.",
        "executionError": "Đã xảy ra lỗi khi thực thi lệnh.",
        "imgurUploaded": "Đã tải ảnh lên Imgur ✅"
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
        const apiUrl = `https://rapido.zetsu.xyz/api/imgur?image=${encodeURIComponent(imageUrl)}`;
        
        const response = await axios.get(apiUrl);
        
        if (!response.data || !response.data.direct_link) {
            return message.reply(getLang("processingError"));
        }
        
        const resultUrl = response.data.direct_link;
        
        await message.reply(`${resultUrl}`);
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
