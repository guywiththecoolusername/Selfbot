module.exports = {
    name: 'c2i',
    description: 'Converts Crypto or INR to corresponding value.',
    
    run: async (client, message, args) => {
        if (!args.length) {
            return message.channel.send("Please provide a valid input. Use {amount}rs for INR or {amount}$/{amount}d for USD/Crypto.");
        }

        const input = args.join(" ");
        let matchRs = input.match(/([\d.]+)(rs)/i);  // Match INR input with decimals
        let matchUsd = input.match(/([\d.]+)(\$|d)/i); // Match USD/Crypto input with decimals

        if (matchRs) {
            const amountInr = parseFloat(matchRs[1]);

            // Condition 1: INR to Crypto (divide by 87 and send the .calc command, then ",ltc")
            const expression = `${amountInr}/87`;
            await message.channel.send(`.calc ${expression}`);
            return message.channel.send(",ltc");
        } 
        else if (matchUsd) {
            const amountUsd = parseFloat(matchUsd[1]);

            // Condition 2: Crypto/USD to INR (multiply by 87 and send .calc command, then ",ltc")
            const expression = `${amountUsd}*87`;
            await message.channel.send(`.calc ${expression}`);
            return message.channel.send(",ltc");
        } 
        else {
            return message.channel.send("Invalid input format. Use {amount}rs for INR or {amount}$/{amount}d for USD/Crypto.");
        }
    }
};

