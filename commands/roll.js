const seedRandom = require('seedrandom');

module.exports = {
    name: 'roll',
    aliases: ['r', 'rolls'],
    description: 'Roll dice of any number.',
    args: true,
    cooldown: 3,
    globalCooldown: false,
    usage: '[amount + d + eyes]  Example: .roll 1d6 to roll a d6 one time, and .roll 2d12 to roll a d12 two times.'
};


module.exports.execute = function (message, args) {
    const param = args[0];
    const errorMessage = `Incorrect command usage.\nCommand syntax: \`${process.env.DEFAULT_PREFIX}${this.name} ${this.usage}\``;
    if (!param.includes('d')) {
        return message.reply(errorMessage);
    }

    let eyes;
    let amount = 1;
    if (param.startsWith('d')) {
        eyes = Number.parseInt(param.substring(1));
    }
    else {
        const dieArgs = param.split('d');
        eyes = Number.parseInt(dieArgs[1]);
        amount = Number.parseInt(dieArgs[0]);
    }

    if (!eyes || eyes === NaN || amount === NaN) {
        return message.reply(errorMessage);
    }

    if (amount > 12) {
        return message.reply("You're rolling too many dice!");
    }

    let result = [];
    for(let i = 0; i < amount; ++i) {
        result.push(`\`${rollDie(eyes)}\``);
    }

    return message.channel.send(`${message.author.username} roll result: ${result.join(', ')}`)
}

function rollDie(max) {
    Math.seedrandom();
    return Math.floor((max * Math.random())) + 1
}
