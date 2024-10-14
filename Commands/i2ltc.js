const fs = require('fs');
const config = require('../config.json'); // Import the config.json file

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Get the text after the prefix and command
        const amount = message.content.slice(prefix.length + 6).trim(); // 6 is the length of "i2ltc "
        
        // Send the text back to the channel
        message.channel.send(`+rep ${config.userid} Legit Exchange • UPI TO LTC [ ${amount} ]`);
    }
};
