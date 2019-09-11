const dndData = require('../../services/data-client');

module.exports = {
  name: 'clear',
  description: 'Remove a user or shared inventory of this session. Tag a user or type `shared` as the `target`',
  args: true,
  cooldown: 3,
  usage: 'inv clear `[target]`'
};

module.exports.execute = async function (message, args) {
  if (args[0] === 'shared') {
    message.channel.send('Cleared shared inventory');
    return {
      name: 'shared',
      content: await dndData.clear(message.guild.id)
    }
  }
  const name = message.mention.user[0].nickname;
  message.channel.send('Cleared ' + name + ' inventory')
  return {
    name,
    content: await dndData.clear(message.guild.id, message.mentions.members[0].displayName)
  }
}