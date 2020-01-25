const seedRandom = require('seedrandom');
const scrolls = require('../resource/spells.json');

module.exports = {
    name: 'randomspell',
    aliases: ['rs'],
    description: 'Use random spell.',
    args: true,
    usage: '.rs [element] to pick one spell from that element'
};

module.exports.execute = function (message, args) {
  const element = args[0];

  const scroll = scrolls.find(elem => elem.element === element);
  if (!scroll) {
    return message.channel.send('Cannot find any spell with element ' + element);
  }
  
  Math.seedrandom();
  const spellIndex = Math.floor(scroll.spells.length * Math.random());
  const spellName = scroll.spells[spellIndex];
  return message.channel.send('Obtained ' + spellName + ' from ' + element + ' element');
}
