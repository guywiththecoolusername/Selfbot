const fs = require('fs');
const config = require('../config.json'); // Import the config.json file

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Get the text after the prefix and command
        const amount = message.content.slice(prefix.length + 4).trim(); // 4 is the length of "pay "
        const tn = "I Have Authorised This payment and received my products";
        // Send the text back to the channel
        message.channel.send(`https://quickchart.io/qr?text=${encodeURIComponent(`upi://pay?pa=${config.upi}&am=${amount}&cu=INR&tn=${tn}`)}&size=300&light=cea159&dark=060606&centerImageUrl=https://i.imgur.com/oV0wipt.png&centerImageSizeRatio=0.2`);
message.channel.send(`Sending ₹${amount} To ${config.upi} with tranaction note "${tn}"`);
    }
};
