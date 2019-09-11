const dndData = require('../../services/data-client');

module.exports = {
  name: 'check',
  description: 'Check user inventory, type `inv check shared` to check shared inventory',
  args: true,
  cooldown: 3,
  usage: 'inv check `[shared?]`'
};

module.exports.execute = async function (message, args) {
  if (args[0] === 'shared') {
    return {
      name: 'shared',
      content: await dndData.getInventory(message.guild.id)
    }
  }
  return {
    name: message.author.nickname,
    content: await dndData.getInventory(message.guild.id, message.author.id)
  }
}