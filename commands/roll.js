const seedRandom = require('seedrandom');

module.exports = {
    name: 'roll',
    aliases: ['r', 'rolls'],
    description: 'Roll dice of any number.',
    args: true,
    usage: '[amount + d + eyes]  Example: .roll 1d6 to roll a d6 one time, and .roll 2d12 to roll a d12 two times.'
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

        if (!eyes || !amount) {
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
    let eyes;
    if (str.startsWith('d')) {
        eyes = str.substring(1);
    }
    else {
        eyes = str.split('d').pop();
    }

    const addition = eyes.split('+')[1];
    const subtraction = eyes.split('-')[1];
    if (!isNaN(eyes)) {
        let result = Number.parseInt(eyes);
        if (addition && !isNaN(addition)) {
            return result + Number.parseInt(addition);
        }
        else if (subtraction && !isNaN(subtraction)) {
            return result + Number.parseInt(subtraction);
        }
        return result;
    }
    return null;
}

function parseAmount(str) {
    if (str.startsWith('d')) {
        return 1;
    }
    let amount = str.split('d').shift();
    if (!isNaN(amount)) {
        return Number.parseInt(amount);
    }
    return null;
}