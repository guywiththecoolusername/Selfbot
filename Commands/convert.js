const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    run: async (client, message, handler, prefix) => {
        let upiid;

        // Check if the message is a reply
        if (message.reference) {
            // Fetch the replied-to message
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
            upiid = repliedMessage.content;
        } else {
            // Get the text after the prefix and command
            upiid = message.content.slice(prefix.length + 8).trim(); // 8 is the length of "convert "
        }

        // Check if upiid is empty
        if (!upiid) {
            return message.channel.send('Error: UPI ID is missing. Please reply to a message or include the UPI ID after the command.');
        }

        // Generate QR code using GoQR API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`upi://pay?pa=${upiid}&cu=INR`)}&size=300x300&color=060606&bgcolor=cea159`;

        // Send the QR code URL
        message.channel.send(qrUrl);
    }
};
