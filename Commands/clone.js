module.exports = {
    name: 'clone',
    description: 'Clone the server into another server',

    run: async (client, message, args) => {
        const sourceGuild = message.guild;  // The server to be cloned
        const targetGuildID = args[0];      // Destination server ID
        
        if (!targetGuildID) return message.channel.send("Please provide the target server ID.");
        
        const targetGuild = client.guilds.cache.get(targetGuildID);
        if (!targetGuild) return message.channel.send("Target server not found or bot isn't in the server.");

        try {
            // Clone Roles First
            const roleMappings = {};
            for (const role of sourceGuild.roles.cache.sort((a, b) => a.position - b.position).values()) {
                if (!role.managed && role.name !== "@everyone") {
                    const newRole = await targetGuild.roles.create({
                        name: role.name,
                        color: role.color,
                        hoist: role.hoist,
                        permissions: role.permissions.bitfield,
                        mentionable: role.mentionable,
                        position: role.position
                    });
                    roleMappings[role.id] = newRole.id;
                }
            }

            // Clone Channels and Categories
            const categoryMappings = {};
            for (const category of sourceGuild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').values()) {
                const newCategory = await targetGuild.channels.create(category.name, {
                    type: 'GUILD_CATEGORY',
                    position: category.position
                });
                categoryMappings[category.id] = newCategory.id;

                // Clone category permissions
                await cloneChannelPermissions(category, newCategory, roleMappings);
            }

            // Clone Text/Voice Channels
            for (const channel of sourceGuild.channels.cache.filter(c => c.type !== 'GUILD_CATEGORY').values()) {
                const newChannel = await targetGuild.channels.create(channel.name, {
                    type: channel.type,
                    parent: channel.parentId ? categoryMappings[channel.parentId] : null,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate || null,  // Only for voice channels
                    userLimit: channel.userLimit || null,  // Only for voice channels
                    position: channel.position
                });

                // Clone channel permissions
                await cloneChannelPermissions(channel, newChannel, roleMappings);
            }

            message.channel.send("Server cloned successfully with roles and permissions!");
        } catch (error) {
            console.error("Error cloning server:", error);
            message.channel.send("There was an error while cloning the server.");
        }
    }
};

// Helper function to clone permissions for a channel
async function cloneChannelPermissions(oldChannel, newChannel, roleMappings) {
    try {
        for (const overwrite of oldChannel.permissionOverwrites.cache.values()) {
            const allow = overwrite.allow.bitfield;
            const deny = overwrite.deny.bitfield;

            let newOverwriteID;
            if (overwrite.type === 'role') {
                newOverwriteID = roleMappings[overwrite.id] || newChannel.guild.roles.everyone.id;
            } else if (overwrite.type === 'member') {
                newOverwriteID = overwrite.id;  // User overwrites stay the same
            }

            await newChannel.permissionOverwrites.create(newOverwriteID, { allow, deny });
        }
    } catch (error) {
        console.error(`Error cloning permissions for channel ${oldChannel.name}:`, error);
    }
}
