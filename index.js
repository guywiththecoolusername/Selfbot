const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const config = require('./config.json'); // Import the config.json file

const client = new Client({
    checkUpdate: false
});

let prefix = config.prefix; // Set default prefix from config

// Load commands
client.commands = new Map();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const commandName = file.split('.')[0];
    const command = require(`./Commands/${file}`);
    client.commands.set(commandName, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    // Ignore messages from other users or bots
    if (message.author.id !== client.user.id) return;

    // Set prefix command
    if (message.content.toLowerCase().startsWith('setprefix ')) {
        const newPrefix = message.content.split(' ')[1];
        
        if (newPrefix.length === 1) {
            prefix = newPrefix;
            message.channel.send(`Prefix set to: ${prefix}`);
        } else {
            message.channel.send('Prefix must be a single character.');
        }
        return;
    }

    // Check if the message starts with the current prefix
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if the command exists
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        // Run the command
        await command.run(client, message, args, prefix);
    } catch (error) {
        console.error(error);
        message.channel.send('There was an error executing that command.');
    }
});

// Listen to all messages for pings while AFK
client.on('messageCreate', async message => {
    if (message.author.id !== client.user.id) {
        // If there's an AFK command, handle pings
        const afkCommand = client.commands.get('afk');
        if (afkCommand) {
            try {
                await afkCommand.handlePing(client, message);
            } catch (error) {
                console.error(error);
            }
        }
    }
});

// AUTO RESPONDER STARTS HERE
let autoResponders = [];

// Load auto responders from file if it exists
const loadAutoResponders = () => {
    const filePath = './Commands/auto_responder.json'; // Adjust path as needed
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        autoResponders = JSON.parse(data);
    }
};

// Save auto responders to file
const saveAutoResponders = () => {
    const filePath = './Commands/auto_responder.json'; // Adjust path as needed
    fs.writeFileSync(filePath, JSON.stringify(autoResponders, null, 2));
};

// Respond to AR commands
const handleCommand = (message, args) => {
    const command = args[0].toLowerCase();

    switch (command) {
        case 'add': {
            const trigger = args[1];
            const response = args.slice(2).join(' ');
            if (!trigger || !response) {
                return message.channel.send('Usage: **ar add {trigger} {response}**');
            }
            autoResponders.push({ trigger, response });
            saveAutoResponders();
            message.channel.send(`✅ Auto-responder added for: **${trigger}**`);
            break;
        }

        case 'edit': {
            const editTrigger = args[1];
            const editResponse = args.slice(2).join(' ');
            const index = autoResponders.findIndex(r => r.trigger.toLowerCase() === editTrigger.toLowerCase());
            if (index !== -1) {
                autoResponders[index].response = editResponse;
                saveAutoResponders();
                message.channel.send(`✏️ Auto-responder updated for: **${editTrigger}**`);
            } else {
                message.channel.send(`❌ No auto-responder found for: **${editTrigger}**`);
            }
            break;
        }

        case 'delete': {
            const deleteTrigger = args[1];
            const initialLength = autoResponders.length;
            autoResponders = autoResponders.filter(r => r.trigger.toLowerCase() !== deleteTrigger.toLowerCase());
            saveAutoResponders();
            if (autoResponders.length < initialLength) {
                message.channel.send(`🗑️ Auto-responder deleted for: **${deleteTrigger}**`);
            } else {
                message.channel.send(`❌ No auto-responder found for: **${deleteTrigger}**`);
            }
            break;
        }

        case 'list': {
            const responseList = autoResponders.map(r => `**${r.trigger}**: ${r.response}`).join('\n') || 'No auto-responders found.';
            message.channel.send(`📜 **Current Auto-Responders:**\n${responseList}`);
            break;
        }

        default:
            message.channel.send('❓ Unknown command. Use **add**, **edit**, **delete**, or **list**.');
    }
};

// Respond to messages
client.on('messageCreate', message => {
    // Ignore messages from other users
    if (message.author.id !== client.user.id) return;

    // Check for AR commands (starting with 'ar ')
    if (message.content.startsWith('ar ')) {
        const args = message.content.slice(3).trim().split(/ +/);
        handleCommand(message, args);
        return;
    }

    // Check for auto-responder triggers (case-insensitive, full message match)
    const messageContent = message.content.trim().toLowerCase();
    for (const responder of autoResponders) {
        if (messageContent === responder.trigger.toLowerCase()) {
            message.channel.send(responder.response);
        }
    }
});
  loadAutoResponders();

// AUTO RESPONDER ENDS HERE
client.login(config.token).catch(console.error);
 // Login using token from config.json
