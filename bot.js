const Discord = require('discord.js');
const fs = require('fs');
const context = require('./services/context');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = process.env.DEFAULT_PREFIX;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('your fate unfold. v2.0', { type: "WATCHING" });
});

client.on('error', (err) => {
    console.error(err)}
);

client.on('message', (message) => {
    if (!message.content.startsWith(prefix)
        || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const registeredChannels = context.getChannels();
    if (!registeredChannels || !registeredChannels.includes(message.channel.id)) {
        return;
    }

    if (command.args && !args.length) {
        let reply = "Incorrect command usage.";

        if (command.usage) {
            reply += `\nCommand syntax: \`${prefix}${commandName} ${command.usage}\``;
        }

        return message.reply(reply);
    }

    try {
        if (!command.ownerOnly || message.author.id == process.env.OWNER_ID) {
            command.execute(message, args);
        }
    } catch (error) {
        console.error(error);
        message.reply("Error executing command!");
    };
});

client.login(process.env.BOT_TOKEN);
