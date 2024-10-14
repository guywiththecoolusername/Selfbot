const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const { Guild } = require('discord.js-selfbot-v13');

// Extend the Guild class with the markAsRead method
Guild.prototype.markAsRead = function() {
    return this.client.api.guilds(this.id).ack.post();
};

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Fetch all the guilds the bot is part of
        const guilds = client.guilds.cache;

        if (guilds.size === 0) {
            return message.channel.send('No guilds found.');
        }

        let successCount = 0;
        let failureCount = 0;

        // Loop through all the guilds
        guilds.forEach(async guild => {
            try {
                await guild.markAsRead(); // Mark the guild as read
                successCount++;
            } catch (error) {
                console.error(`Error marking guild ${guild.name} as read:`, error);
                failureCount++;
            }
        });

        // Send a final response once all guilds have been processed
        setTimeout(() => {
            message.channel.send(`Marked ${successCount} guilds as read. Failed to mark ${failureCount} guilds.`);
        }, 1000); // Add a slight delay to allow all requests to process
    }
};
