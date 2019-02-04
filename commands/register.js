const context = require('../services/context');

module.exports = {
    name: 'register',
    aliases: ['reg'],
    description: 'Register channel',
    args: true,
    cooldown: 3,
    globalCooldown: false,
    usage: '[channelId]',
    ownerOnly: true
};

module.exports.execute = async function (message, args) {
    let channelIds = [];
    for (let i = 0; i < args.length; ++i) {
        if (isNaN(args[i])) {
            await message.channel.send("Unrecognized ID " + args[i]);
        }
        else {
            channelIds.push(args[i]);
        }
    }
    message = await message.channel.send("Registering channels " + channelIds.join(", ") + "...");

    if (channelIds.length > 0) {
        for (let i = 0; i < args.length; ++i) {
            await context.addChannel(channelIds[i]);
        }
    }

    message.edit("Registered channels " + channelIds.join(", "));
}
