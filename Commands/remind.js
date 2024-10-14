const fs = require('fs')
const {
    Appembed
} = require('kyz');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=Type%20%22VARremind%201m%20take%20out%20the%20trash%22%20to%20be%20reminded%20in%201%20minute%20to%20take%20out%20the%20trash%0A%0A30s%2C%205m%2C%202h%2C%201d&color=%23FF0000&author=VARremind',
    run: async (client, message, handler, prefix, MyID) => {
        if (message.author.id !== client.user.id) return;
        message.react(config.successEmoji).catch(err => message.react('👍').catch(e => console.log(e)));
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const time = args[1];
        const reminder = args.slice(2).join(' ');

        if (!time || !reminder) {
            return message.channel.send(`${config.longstringoftext} https://appembed.netlify.app/e?description=Please%20provide%20a%20valid%20time%20and%20reminder%20message!%0A%0A${prefix}remind%205m%20take%20out%20the%20trash&color=%23FF0000&author=Error`);
        }

        const timeRegex = /^(\d+)(s|m|h|d)$/;
        const match = time.match(timeRegex);

        if (!match) {
            return message.channel.send(`${config.longstringoftext} https://appembed.netlify.app/e?description=Please%20provide%20a%20valid%20time%20format!%0A%0A30s%20%E2%86%92%2030%20seconds%0A5m%20%E2%86%92%205%20minutes%0A2h%20%E2%86%92%202%20hours%0A1d%20%E2%86%92%201%20day&color=%23FF0000&author=Error`);
        }

        const duration = parseInt(match[1]);
        const unit = match[2];

        // Calculate the milliseconds for the reminder
        let milliseconds = 0;
        switch (unit) {
            case 's':
                milliseconds = duration * 1000;
                break;
            case 'm':
                milliseconds = duration * 60 * 1000;
                break;
            case 'h':
                milliseconds = duration * 60 * 60 * 1000;
                break;
            case 'd':
                milliseconds = duration * 24 * 60 * 60 * 1000;
                break;
            default:
                break;
        }

        const reminderEmbed = new Appembed()
            .setAuthor(`You have an reminder ${message.author.username}!`)
            .setDescription(`${reminder}`)
            .setColor("#FF0000")
            .build();

        setTimeout(() => {
            message.reply(`${config.longstringoftext} ${reminderEmbed}`);
        }, milliseconds);
    }
};