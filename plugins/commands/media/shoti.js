import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = {
    name: "شوتي"
}

async function onCall({ message }) {
    try {
        const apiResponse = await axios.get("https://shoti.fbbot.org/api/get-shoti");
        const videoData = apiResponse.data.result;
        
        const videoResponse = await axios({
            url: videoData.content,
            method: 'GET',
            responseType: 'stream'
        });

        const cachePath = path.join(global.cachePath, 'shoti.mp4');
        const writer = fs.createWriteStream(cachePath);
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        message.reply({
            body: `@${videoData.user.username}`,
            attachment: fs.createReadStream(cachePath)
        });

    } catch (error) {
        console.error(error);
        message.reply("❌ Error fetching Shoti video");
    }
}

export default {
    config,
    onCall
}
