const fs = require('fs');

const optionFiles = fs.readdirSync('./inventory').filter(file => file.endsWith('.js'));
let options = {};
for (const file in optionFiles) {
  const option = require(`./inventory/${file}`);
  options[option.name] = option;
}

module.exports = {
  name: 'inventory',
  aliases: ['i', 'inv'],
  description: 'Party inventory',
  args: true,
  cooldown: 3,
  globalCooldown: false,
  usage: 'inv [option]'
};

function display(message, name, inventory) {
  let content = "```===========" + name + " inventory===========\n";
    if (!inventory) {
      content += "None";
    }
    else {
      for (let itemName in inventory) {
        if (inventory.hasOwnProperty(itemName)) {
          content += itemName + " x" + inventory[itemName] + "\n";
        }
      }
    }
    
  invString += "```";
  return message.channel.send(content)
}

module.exports.execute = async function (message, args) {
  const name = args[0];
  if (!options[name]) {
    return this.help(message);
  }

  const inv = options[name].execute(message, args);
  return display(inv);
}

module.exports.help = function(message) {

}