const moment = require('moment');

// AFK state and muted users
let afkData = {
    isAFK: false,
    reason: '',
    startTime: null,
    pings: []
};

let mutedUsers = new Map(); // Map to store muted users and their expiration time

module.exports = {
    name: 'afk',
    description: 'Go AFK with an optional reason, and return from AFK.',
    
    run: async (client, message, args) => {
        const command = args[0];

        // AFK command to go AFK
        if (command === 'set') {
            const reason = args.slice(1).join(' ') || 'None';
            afkData = {
                isAFK: true,
                reason: reason,
                startTime: Date.now(),
                pings: []
            };

            return message.channel.send(`You are now AFK. Reason: ${reason}`);
        }

        // Command to come back from AFK
        if (command === 'unset') {
            if (!afkData.isAFK) {
                return message.channel.send("You're not AFK.");
            }

            const afkDuration = moment(afkData.startTime).fromNow(true);
            let response = `You were AFK for **${afkDuration}**.\n`;

            if (afkData.pings.length > 0) {
                response += `Here are the mentions you missed:\n`;

                afkData.pings.forEach(ping => {
                    const timeAgo = moment(ping.timestamp).fromNow();
                    response += `${ping.author} mentioned you ${timeAgo}: [${ping.messageContent}.](${ping.messageLink})\n`;
                });
            } else {
                response += "No one mentioned you while you were AFK.";
            }

            afkData.isAFK = false;
            return message.channel.send(response);
        }
    },

    handlePing: async (client, message) => {
        const authorId = message.author.id;

        // Check if the user is muted and skip if they are
        if (mutedUsers.has(authorId)) {
            const muteExpiration = mutedUsers.get(authorId);
            if (Date.now() < muteExpiration) {
                return; // Skip responding to muted users
            } else {
                mutedUsers.delete(authorId); // Remove from the muted list if 24h has passed
            }
        }

        // If the message mentions the bot and contains "stfu", mute for 24 hours
        if (message.mentions.has(client.user) && message.content.toLowerCase().includes('stfu')) {
            mutedUsers.set(authorId, Date.now() + 24 * 60 * 60 * 1000); // Mute for 24 hours
            return message.reply("I'll stop bothering you for the next 24 hours.");
        }

        if (afkData.isAFK) {
            // Ignore @here, @everyone, and role mentions
            if (message.mentions.everyone || message.mentions.roles.size > 0) return;

            // Check if the bot is mentioned directly
            if (!message.mentions.has(client.user)) return;

            const timeSinceAFK = moment(afkData.startTime).fromNow(true);
            const afkReply = `I'm currently AFK. Reason: ${afkData.reason}\nI went AFK ${timeSinceAFK} ago.\n\n` +
                             `If this is annoying, just mention me and say "stfu", and I won't reply for the next 24 hours.`;

            // Check if this is a DM (message.guild will be null in DMs)
            const isDM = message.guild === null;

            // Save the ping details
            afkData.pings.push({
                author: message.author.tag,
                messageLink: isDM
                    ? `DM` // For DMs, we don't have a message link
                    : `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
                messageContent: message.content,
                timestamp: Date.now()
            });

            message.reply(afkReply);
        }
    }
};
