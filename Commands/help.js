const fs = require('fs');
const path = require('path');

module.exports = {
    run: async (client, message, args, prefix) => {
        try {
            // Read the Commands directory
            const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js'));

            // Create a list of command names
            const commandNames = commandFiles.map(file => file.split('.')[0]);

            // Create the response message
            const responseMessage = `**Available Commands:**\n${commandNames.join(', ')}`;

            // Send the response message
            message.channel.send(responseMessage);
        } catch (error) {
            console.error('Error listing commands:', error);
            message.channel.send('Error: Unable to list commands.');
        }
    }
};
