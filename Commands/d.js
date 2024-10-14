const config = require('../config.json'); // Import the config.json file

module.exports = {
    run: async (client, message, args, prefix) => {
        // Send the initial message
        const msg = await message.channel.send(`$rename done by ${config.urname}`);

        // Get all messages in the channel
        const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });

        // Filter the messages to those from users without the role "- Client"
        const nonClientMembers = new Map();
        fetchedMessages.forEach(msg => {
            const member = msg.member;
            if (member && !member.roles.cache.some(role => role.name === '- Client') && !member.user.bot) {
                nonClientMembers.set(member.user.username, member.user.id);
            }
        });

        if (nonClientMembers.size > 0) {
            // Create a message listing users without the "- Client" role
            const reply = await message.channel.send(`Users without the "- Client" role: ${[...nonClientMembers.keys()].join(', ')}. Do you want to assign the "Client" role to these users? Reply with 'yes' or 'no'.`);

            // Create a message collector to get the user's response
            const filter = response => response.author.id === client.user.id && ['yes', 'no'].includes(response.content.toLowerCase());
            const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1 });

            collector.on('collect', async collected => {
                if (collected.content.toLowerCase() === 'yes') {
                    for (const [username, userId] of nonClientMembers) {
                        await message.channel.send(`.client ${userId}`);
                    }
                }
                collected.delete().catch(console.error);
            });

            collector.on('end', () => {
                // Delete the original command, the permission request, and the reply after 5 seconds
                setTimeout(() => {
                    message.delete().catch(console.error);
                    msg.delete().catch(console.error);
                    reply.delete().catch(console.error);
                }, 5000);
            });
        } else {
            // Delete the original command and the output after 5 seconds
            setTimeout(() => {
                message.delete().catch(console.error);
                msg.delete().catch(console.error);
            }, 5000);
        }
    }
};
