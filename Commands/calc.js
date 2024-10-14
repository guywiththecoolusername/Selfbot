const { evaluate } = require('mathjs');

module.exports = {
    run: async (client, message, handler, prefix) => {
        const expression = message.content.slice(prefix.length + 5).trim();

        try {
            const result = evaluate(expression);
	    const messagetosend = `
	       	__**Calculation**__
		__**Input:**__
	       ${expression}

		__**Output:**__
		${result}
		`;
            message.channel.send(messagetosend);
        } catch (error) {
            message.channel.send(`Error: Invalid expression`);
        }
    }
};
