const dndData = require('../../services/data-client');

module.exports = {
  name: 'use',
  description: 'use an item in inventory, default amount is 1',
  args: true,
  cooldown: 3,
  usage: 'inv use `[name]` `[amount?]`'
};

module.exports.execute = async function (message, args) {
  const inv = dndData.getInventory(message.guild.id, message.author.id);
  const sharedInv = dndData.getInventory(message.guild.id)
  const name = args[0];
  const amount = args[1];
  if (inv[name] || sharedInv[name]) {
    message.channel.send(`used x${amount} ${name}`)
  }
  else {
    throw new Error(`item ${name} not found in personal and shared inventory.`);
  }

  if (inv[name]) {
    return await dndData.useItem(message.guild.id, name, amount, message.author.id);
  }
  else if (sharedInv[name]) {
    return await dndData.useItem(message.guild.id, name, amount);
  }
}