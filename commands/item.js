const dndData = require('../services/data-client');

module.exports = {
    name: 'inventory',
    aliases: ['i', 'inv'],
    description: 'Party inventory',
    args: false,
    cooldown: 3,
    globalCooldown: false,
    usage: 'inv: Check party inventory.\n' +
        'inv add `[name]` `[amount?]`: Add an item to inventory. Default amount is 1 if not set.\n' +
        'inv remove `[name]` `[amount?]`: Remove an item to inventory. Default amount is 1 if not set.\n' +
        'inv use `[name]` `[amount?]`: Same as remove.\n' +
        'inv clear: clear inventory items'
};

module.exports.execute = async function (message, args) {
    const subCommands = ['add', 'remove', 'use', 'clear'];
    if (args.length && subCommands.includes(args[0].toLowerCase())) {
        return await executeSubCommands(message, args);
    }
    else if (!args.length) {
        const inventory = await dndData.getInventory();
        let invString = "```===========Inventory===========\n";
        if (!inventory) {
            invString += "None";
        }
        else {
            for (let itemName in inventory) {
                if (inventory.hasOwnProperty(itemName)) {
                    invString += itemName + " x" + inventory[itemName] + "\n";
                }
            }
        }
        invString += "```";

        return message.channel.send(invString);
    }
    return message.channel.send(this.usage);
}

async function executeSubCommands(message, args) {
    let amount = 1;
    if (args.length > 2) {
        if (isNaN(args[2])) {
            return message.channel.send('Amount must be valid number');
        }
        amount = args[2] * 1;
    }

    const subCommand = args[0].toLowerCase();
    if (subCommand === 'add') {
        const itemName = args[1].toLowerCase();

        await dndData.addItem(itemName, amount);
        return message.channel.send(`Added \`\`\`${itemName} x${amount}\`\`\``);
    }

    if (subCommand === 'use' || subCommand === 'remove') {
        const itemName = args[1].toLowerCase();
        const inventory = await dndData.getInventory();

        if (inventory && inventory[itemName] && inventory[itemName] > 0) {
            const amountUsed = Math.min(inventory[itemName], amount);
            await dndData.removeItem(itemName, amount);
            return message.channel.send(`Removed \`\`\`${itemName} x${amountUsed}\`\`\``);
        }
        else {
            return message.channel.send(`Cannot find ${itemName} in inventory.`);
        }
    }

    if (subCommand === 'clear') {
        await dndData.clear();
        return message.channel.send(`Cleared all items from inventory.`);
    }
}