module.exports = {
    name: 'i2c',
    description: 'Converts INR or Crypto to the corresponding value based on currency input.',
    
    run: async (client, message, args) => {
        if (!args.length) {
            return message.channel.send("Please provide a valid input. Use {amount}rs for INR or {amount}$/{amount}d for USD/Crypto.");
        }

        const input = args.join(" ");
        let matchRs = input.match(/([\d.]+)(rs)/i);  // Match INR input with decimals
        let matchUsd = input.match(/([\d.]+)(\$|d)/i); // Match USD/Crypto input with decimals

        if (matchRs) {
            const amountInr = parseFloat(matchRs[1]);

            // Condition 1: INR to Crypto (send the .calc command and then .qr)
            const expression = `${amountInr}/91`;
            await message.channel.send(`.calc ${expression}`);  // Send calculation
            return message.channel.send(`.qr ${amountInr}`);     // Send original amount with .qr
        } 
        else if (matchUsd) {
            const amountUsd = parseFloat(matchUsd[1]);

            // Condition 2: Crypto/USD to INR, approximate to a non-decimal number
            const result = Math.round(amountUsd * 91); // Multiply by 91 and round
            await message.channel.send(`.calc ${amountUsd}*91`); // Send the calculation
            return message.channel.send(`.qr ${result}`);  // Send the rounded result
        } 
        else {
            return message.channel.send("Invalid input format. Use {amount}rs for INR or {amount}$/{amount}d for USD/Crypto.");
        }
    }
};

