const { Guild } = require('discord.js-selfbot-v13');

// Extend the Guild class with the markAsRead method
Guild.prototype.markAsRead = function() {
    return this.client.api.guilds(this.id).ack.post();
};
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Get the guild where the command is executed
        const guild = message.guild;

        // Check if guild exists
        if (guild) {
            try {
                await guild.markAsRead(); // Mark the guild as read
                message.channel.send('Guild marked as read.');
            } catch (error) {
                console.error('Error marking the guild as read:', error);
                message.channel.send('Failed to mark the guild as read.');
            }
        } else {
            message.channel.send('Could not find the guild.');
        }
    }
};
