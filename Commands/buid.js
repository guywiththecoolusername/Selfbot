const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Get the text after the prefix and command
        const amount = message.content.slice(prefix.length + 4).trim(); // 4 is the length of "pay "

        try {
            // Delete the user's message
            await message.delete();

            // Send the text back to the channel
            message.channel.send("746457618");
        } catch (error) {
            console.error("Error deleting the message:", error);
        }
    }
};
