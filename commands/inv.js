const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Connection = mongoose.connection;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

Connection.on('error', console.error.bind(console, 'inventory connection error'));
Connection.on('connected', console.log.bind(console, 'connected to inventory'));
Connection.on('disconnected', console.log.bind(console, 'disconnected from inventory'));

let InventorySchema = new Schema({
  name: String,
  items: Array
});

let inventories = mongoose.model('inventory', InventorySchema)

module.exports = {
  name: 'inventory',
  aliases: ['inv'],
  description: 'Access inventory',
  args: true,
  usage: '[name] [command]'
};

module.exports.execute = async function (message, args) {
  const invName = args[0];
  const command = args[1];
  
  let botMessage;
  if (!command) {
    botMessage = await showInventory(invName);
    return message.channel.send(botMessage);
  }

  switch (command.toLowerCase()) {
    case 'add':
      let addAmount = args[3];

      if (addAmount === undefined) {
        addAmount = 1;
      }

      if (isNaN(addAmount)) {
        return message.channel.send(addAmount + ' is not a valid amount.');
      }

      botMessage = await addItem(invName, args[2], addAmount);
      return message.channel.send(botMessage);

    case 'remove':
      let removeAmount = args[3];

      if (removeAmount === undefined) {
        removeAmount = 1;
      }

      if (isNaN(removeAmount)) {
        return message.channel.send(removeAmount + ' is not a valid amount.');
      }

      botMessage = await removeItem(invName, args[2], removeAmount);
      return message.channel.send(botMessage);

    case 'new':
      botMessage = await newInventory(invName);
      return message.channel.send(botMessage);

    default:
      return message.channel.send('Invalid command. Available commands are `new`, `add`, `remove`');
  }
}

async function newInventory(name) {
  const inv = await inventories.findOne({ name }).exec();
  if (inv) {
    return name + ' already exists.';
  }

  let newInv = new inventories({
    name,
    items: []
  })

  await newInv.save();
  return await showInventory(name);
}

async function showInventory(name) {
  const inv = await inventories.findOne({ name }).exec();
  if (inv) {
    let message = '```\n';

    if (inv.items.length > 0) {
      for (let i = 0; i < inv.items.length; ++i) {
        message += inv.items[i].name + ' x'+ inv.items[i].amount + '\n';
      }
    }
    else {
      message += 'Empty.';
    }

    message += '```';
    return message;
  }

  return 'No `' + name + '` inventory found. Make sure to create one first with `[name] new` command!';
}

async function addItem(name, itemName, itemAmount) {
  const inv = await inventories.findOne({ name }).exec();
  if (inv) {
    let item = inv.items.find(i => i.name === itemName);
    if (item) {
      item.amount += parseInt(itemAmount);
    }
    else {
      item = {
        name: itemName,
        amount: parseInt(itemAmount)
      };

      inv.items.push(item);
    }

    await inventories.findOneAndUpdate({ name }, { items: inv.items }).exec();

    return `Added ${itemName} x${itemAmount}, \`${name}\` now has ${itemName} x${item.amount}.`
  }

  return 'No `' + name + '` inventory found. Make sure to create one first with `[name] new` command!';
}

async function removeItem(name, itemName, itemAmount) {
  const inv = await inventories.findOne({ name }).exec();
  if (inv) {
    let item = inv.items.find(i => i.name === itemName);
    if (item) {
      item.amount -= parseInt(itemAmount);

      if (item.amount > 0) {
        await inventories.findOneAndUpdate({ name }, { items: inv.items }).exec();
        return `Removed ${itemName} x${itemAmount}, \`${name}\` now has ${itemName} x${item.amount}.`
      }
      
      inv.items = inv.items.filter(item => item.amount > 0);
      await inventories.findOneAndUpdate({ name }, { items: inv.items }).exec();
      return `Removed all ${itemName} from \`${name}\`.`
    }

    return 'Cannot find ' + itemName + ' in `' + name + '`';
  }

  return 'No `' + name + '` inventory found. Make sure to create one first with `[name] new` command!';
}