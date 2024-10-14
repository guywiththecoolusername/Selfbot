const axios = require('axios');
const config = require('../config.json'); // Import the config.json file
const litecoinAddress = config.addy;

module.exports = {
    run: async (client, message, handler, prefix) => {
        try {
            // Fetch LTC balance data from BlockCypher
            const balanceResponse = await axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${litecoinAddress}`);
            const balanceData = balanceResponse.data;

            // Fetch LTC price from CoinGecko
            const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
            const ltcPriceInUsd = priceResponse.data.litecoin.usd;

            // Extract balance information
            const totalBalance = balanceData.balance / 1e8; // Convert from satoshis to LTC
            const unconfirmedBalance = balanceData.unconfirmed_balance / 1e8; // Convert from satoshis to LTC
            const totalReceived = balanceData.total_received / 1e8; // Convert from satoshis to LTC

            // Convert to USD
            const totalValueInUsd = (totalBalance * ltcPriceInUsd).toFixed(2);
            const unconfirmedValueInUsd = (unconfirmedBalance * ltcPriceInUsd).toFixed(2);
            const totalReceivedValueInUsd = (totalReceived * ltcPriceInUsd).toFixed(2);

            // Create the response message
            const responseMessage = `
            **BALANCE**
            **ADDRESS:** ${litecoinAddress}
            **Total Balance**
            LTC - ${totalBalance.toFixed(8)}
            USD - $${totalValueInUsd}
            **Unconfirmed Balance**
            LTC - ${unconfirmedBalance.toFixed(8)}
            USD - $${unconfirmedValueInUsd}
            **Total Received**
            LTC - ${totalReceived.toFixed(8)}
            USD - $${totalReceivedValueInUsd}
            `;

            // Send the response message to the Discord channel
            message.channel.send(responseMessage);
        } catch (error) {
            console.error('Error fetching balance:', error);
            message.channel.send(`Error: Unable to fetch balance for ${litecoinAddress}`);
        }
    }
};
