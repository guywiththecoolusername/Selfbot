const axios = require('axios');

module.exports = {
    name: 'ltcinfo',
    description: 'Check the info of a Litecoin transaction by transaction ID.',
    
    run: async (client, message, args) => {
        const txId = args[0];

        if (!txId) {
            return message.channel.send('🔍 **Please provide a transaction ID.**');
        }

        try {
            const txResponse = await axios.get(`https://api.blockcypher.com/v1/ltc/main/txs/${txId}`);
            const transaction = txResponse.data;

            if (!transaction || transaction.error) {
                return message.channel.send('❌ **Transaction not found or invalid transaction ID.**');
            }

            // Remove sender addresses
            const receiverAddresses = transaction.outputs.map(output => output.addresses).flat();

            const totalSent = transaction.outputs.reduce((sum, output) => sum + output.value, 0) / 100000000; // Convert to LTC
            
            // Fetch current LTC price in USD
            const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
            const ltcPrice = priceResponse.data.litecoin.usd;

            const totalSentUSD = (totalSent * ltcPrice).toFixed(2);

            const confirmedTime = new Date(transaction.confirmed).toLocaleString();
            const blockCypherLink = `https://live.blockcypher.com/ltc/tx/${txId}/`;

            const transactionInfo = `
                🌟 **Transaction Details** 🌟
                ────────────────────────
		**🔹 Receiver Addresses:** *${receiverAddresses.join(', ') || 'Unknown'}*
                **🔹 Total Sent:** *${totalSent} LTC*  ($${totalSentUSD})
                **🔹 Confirmed Time:** *${confirmedTime}*
                **🔹 View on BlockCypher:** 🔗[Link](${blockCypherLink})
                ────────────────────────
           `;

            return message.channel.send(transactionInfo);
        } catch (error) {
            console.error('Error fetching transaction info:', error);
            return message.channel.send('❌ **An error occurred while fetching the transaction information.**');
        }
    }
};
