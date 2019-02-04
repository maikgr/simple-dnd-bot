const seedRandom = require('seedrandom');

module.exports = {
    name: 'roll',
    aliases: ['r', 'rolls'],
    description: 'Roll dice of any number.',
    args: true,
    cooldown: 3,
    globalCooldown: false,
    usage: '[amount + d + eyes]  Example: .roll 1d6 to roll a d6 one time, and .roll 2d12 to roll a d12 two times.',
    ownerOnly: false
};


module.exports.execute = function (message, args) {
    const errorMessage = `Incorrect command usage.\nCommand syntax: \`${process.env.DEFAULT_PREFIX}${this.name} ${this.usage}\``;

    for (let i = 0; i < args.length; ++i) {
        const param = args[i];
        if (!param.includes('d')) {
            return message.reply(errorMessage);
        }

        const eyes = parseEyes(param);
        const amount = parseAmount(param);

        if (!eyes || eyes === NaN || amount === NaN) {
            return message.reply(errorMessage);
        }

        if (amount > 12) {
            return message.reply("You're rolling too many dice!");
        }
        
        const result = rollDie(eyes, amount);
        message.channel.send(`${message.author.username} \`${param}\` roll result: ${result.join(', ')}`);
    }

    return;
}

function rollDie(die, amount) {
    let result = [];
    Math.seedrandom();
    for(let j = 0; j < amount; ++j) {
        const dieResult = Math.floor((die * Math.random())) + 1;
        result.push(`\`${dieResult}\``);
    }
    return result;
}

function parseEyes(str) {
    if (str.startsWith('d')) {
        return Number.parseInt(str.substring(1));
    }
    return Number.parseInt(str.split('d').pop());
}

function parseAmount(str) {
    if (str.startsWith('d')) {
        return 1;
    }
    return Number.parseInt(str.split('d').shift());
}