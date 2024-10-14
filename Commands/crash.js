module.exports = {
    run: async (client, message) => {
        if (message.author.id !== client.user.id) return;

        // Confirm the restart command
        await message.channel.send("Crashing bot...");

        // Deliberately crash the bot
        setTimeout(() => {
            // Throw an error to crash the bot
            throw new Error("Bot is crashing for restart.");
        }, 1000); // 1 second delay
    }
};
