const context = require('../services/context');

module.exports = {
    name: 'unregister',
    aliases: ['unreg'],
    description: 'Remove registered channel',
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
    message = await message.channel.send("Unregistering channels " + channelIds.join(", ") + "...");

    if (channelIds.length > 0) {
        for (let i = 0; i < args.length; ++i) {
            await context.removeChannel(channelIds[i]);
        }
    }

    message.edit("Unregistered channels " + channelIds.join(", "));
}
