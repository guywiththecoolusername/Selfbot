const fs = require('fs');
const fetch = require('node-fetch');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Check if the message is a reply to another message with an image
        if (!message.reference) {
            return message.channel.send('Error: You must reply to a message containing a QR code image.');
        }

        // Fetch the replied-to message
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);

        // Check if the replied message contains an attachment (QR code image)
        if (!repliedMessage.attachments.size) {
            return message.channel.send('Error: The replied message does not contain an image.');
        }

        // Get the image URL from the attachment
        const attachment = repliedMessage.attachments.first();
        const imageUrl = attachment.url;

        try {
            // Use GoQR API to decode the QR code
            const response = await fetch(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();

            // Check if there is a decoded result
            if (data[0] && data[0].symbol[0] && data[0].symbol[0].data) {
                const qrCodeData = data[0].symbol[0].data;

                // Send the decoded QR code data in one message
                await message.channel.send(`Decoded QR Code Data: ${qrCodeData}`);

                // Check if the QR code contains a UPI ID
                const upiMatch = qrCodeData.match(/upi:\/\/pay\?pa=([^&]+)/);
                if (upiMatch && upiMatch[1]) {
                    const upiId = upiMatch[1];
                    
                    // Send the UPI ID in a separate message
                    return message.channel.send(upiId);
                }
            } else {
                return message.channel.send('Error: Could not decode the QR code.');
            }
        } catch (error) {
            console.error('Error reading QR code:', error);
            return message.channel.send('Error: Failed to decode the QR code.');
        }
    }
};
