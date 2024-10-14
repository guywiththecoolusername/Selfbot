const fs = require('fs');
const imgur = require('imgur');
const axios = require('axios');
const path = require('path');

let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

imgur.setClientId(config.imgurClientId);

module.exports = {
    run: async (client, message, handler, prefix) => {
        let imageUrl = '';

        // Check if the command is a reply to a message containing an image
        if (message.reference) {
            try {
                const replyMessage = await message.channel.messages.fetch(message.reference.messageId);
                if (replyMessage.attachments.size > 0) {
                    imageUrl = replyMessage.attachments.first().url;
                } else {
                    return message.channel.send('The replied message does not contain an image.');
                }
            } catch (error) {
                console.error('Error fetching the replied message:', error);
                return message.channel.send('Error fetching the replied message.');
            }
        } else if (message.attachments.size > 0) {
            // If the message itself has an attached image
            imageUrl = message.attachments.first().url;
        } else {
            return message.channel.send('Please reply to a message with an image or attach an image.');
        }

        try {
            // Download the image
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const tempFilePath = path.join(__dirname, 'temp_image.png');

            // Save the image temporarily
            fs.writeFileSync(tempFilePath, buffer);

            // Upload to Imgur
            const imgurResponse = await imgur.uploadFile(tempFilePath);

            // Log the full Imgur response for debugging
            console.log('Imgur response:', imgurResponse);

            // Convert response to string and find the link
            const responseString = JSON.stringify(imgurResponse, null, 2);
            const linkMatch = responseString.match(/"link":\s*"([^"]+)"/);

            if (linkMatch && linkMatch[1]) {
                const imgurLink = linkMatch[1];

                // Send the Imgur link
                message.channel.send(`Here is your Imgur link: ${imgurLink}`);
            } else {
                console.error('Imgur response does not contain a link:', imgurResponse);
                throw new Error('Imgur response does not contain a link.');
            }

            // Delete the temporary file
            fs.unlinkSync(tempFilePath);
        } catch (error) {
            console.error('Error uploading the image to Imgur:', error.message);
            message.channel.send('There was an error uploading the image to Imgur.');
        }
    }
};
