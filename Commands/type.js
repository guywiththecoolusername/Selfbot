const ms = require('ms'); // Install this package using `npm install ms`

module.exports = {
    run: async (client, message, args) => {
        try {
            // Extract the text and time from the arguments
            const delayString = args.pop();
            const delay = ms(delayString); // Convert the time string to milliseconds
            const text = args.join(' ');

            // Validate delay and text
            if (!text) {
                return message.channel.send('Please provide text to type.');
            }

            if (!delay) {
                return message.channel.send('Please provide a valid time (e.g., 1s, 1m, 1hr, 1d).');
            }

            // Notify the user that the message will be sent after the specified time
            message.channel.send(`I will type your message in ${delayString}`);

            // Wait for the specified time
            setTimeout(() => {
                message.channel.send(text);
            }, delay);
        } catch (error) {
            console.error('Error with the type command:', error);
            message.channel.send('There was an error executing the type command.');
        }
    }
};
