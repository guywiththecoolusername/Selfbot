const { activeCountings } = require('./countingState'); // Adjust the path as needed

module.exports = {
    run: async (client, message, handler, prefix) => {
        if (activeCountings[message.author.id]) {
            activeCountings[message.author.id] = false; // Stop the counting for this user
            message.channel.send("Counting has been stopped.");
        } else {
            message.channel.send("No active counting to stop.");
        }
    }
};
