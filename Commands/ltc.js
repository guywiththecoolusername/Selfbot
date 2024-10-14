const fs = require('fs');

const config = require('../config.json'); // Import the config.json file
module.exports = {
    run: async (client, message, handler, prefix) => {
        // Get the text after the prefix and command
        const amount = message.content.slice(prefix.length + 4).trim(); // 4 is the length of "pay "
        
        // Send the text back to the channel
        message.channel.send(config.addy);
    }
};
