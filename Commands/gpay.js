const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Get the text after the prefix and command
        const amount = message.content.slice(prefix.length + 4).trim(); // 4 is the length of "pay "
        
        // Send the text back to the channel
        message.channel.send("https://i.imgur.com/7TAg1jp.jpeg");
		message.channel.send("guywiththecoolusername@okhdfcbank");
    }
};
