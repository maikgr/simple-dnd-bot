const inventories = require('../services/data-client').inventories;

module.exports = {
  name: 'money',
  aliases: ['m'],
  description: 'Access money puch',
  args: true,
  usage: '[command] [amount]'
};

module.exports.execute = async function (message, args) {
  const invName = args[0];
  const command = args[1];

  let botMessage;
  if (!command) {
    botMessage = await showMoney(invName);
    return message.channel.send(botMessage);
  }
  
  switch (command.toLowerCase()) {
    case 'add':
      let addAmount = args[2];

      if (addAmount === undefined) {
        return message.channel.send('Please specify the amount of money to add. `.inv [name] add [amount].`');
      }

      if (isNaN(addAmount)) {
        return message.channel.send(addAmount + ' is not a valid amount.');
      }

      botMessage = await addMoney(invName, addAmount);
      return message.channel.send(botMessage);

    case 'remove':
      let removeAmount = args[2];

      if (removeAmount === undefined) {
        return message.channel.send('Please specify the amount of money to remove. `.inv [name] remove [amount].`');
      }

      if (isNaN(removeAmount)) {
        return message.channel.send(removeAmount + ' is not a valid amount.');
      }

      botMessage = await removeMoney(invName, removeAmount);
      return message.channel.send(botMessage);

    default:
      return message.channel.send('Invalid command. Available commands are `add`, `remove`');
  }
}

async function showMoney(name) {
  const inv = await inventories.findOne({ name }).exec();
  if (inv) {
    return name + ' currently contains ' + inv.money + ' money.';
  }

  return 'No `' + name + '` inventory found. Make sure to create one first with `.inv [name] new` command!';
}

async function addMoney(name, amount) {
  const inv = await inventories.findOne({ name }).exec();
  if (inv) {
    const money = inv.money + parseInt(amount);
    await inventories.findOneAndUpdate({ name }, { money }).exec()
    return 'Added ' + amount + ' to money pouch. `' + name + '` now has ' + money + ' money!';
  }

  return 'No `' + name + '` inventory found. Make sure to create one first with `.inv [name] new` command!';
}
async function removeMoney(name, amount) {
  const inv = await inventories.findOne({ name }).exec();
  if (inv) {
    const prevMoney = inv.money;
    const money = Math.max(0, inv.money - parseInt(amount));
    await inventories.findOneAndUpdate({ name }, { money }).exec()
    return 'Removed ' + (prevMoney - money) + ' from money pouch. `' + name + '` now has ' + money + ' money!';
  }

  return 'No `' + name + '` inventory found. Make sure to create one first with `.inv [name] new` command!';
}