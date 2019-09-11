const dndData = require('../../services/data-client');

module.exports = {
  name: 'add',
  description: 'Add an item to this session inventory. Add an item to a user in this session when user is defined.',
  args: true,
  cooldown: 3,
  usage: 'inv add `[name]` `[amount]` `[user?]`'
};

module.exports.execute = async function (message, args) {
  const user = message.mentions.user[0];
  const item = args[0];
  const amount = args[1];
  let result = {
    content: await dndData.addItem(message.guild.id, item, amount, user)
  }
  if (user) {
    result.name = user.nickname;
  }
  else {
    result.name = 'shared';
  }
  message.channel.send(`Added x${amount} ${item}`);
  return result;
}