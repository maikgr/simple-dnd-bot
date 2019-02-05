const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Connection = mongoose.connection;
mongoose.connect(process.env.DATAKEY, { useNewUrlParser: true });

Connection.on('error', console.error.bind(console, 'data service connection error'));
Connection.on('connected', console.log.bind(console, 'connected to data service'));
Connection.on('disconnected', console.log.bind(console, 'disconnected from data service'));

let DataSchema = new Schema({
    session: String,
    inventory: {}
});

let DndData = mongoose.model('dnd-data', DataSchema, 'dnd-data')

module.exports.getInventory = async function () {
    const data = await DndData.findOne().exec();
    return data.inventory;
}

module.exports.addItem = async function (item, amount) {
    let inventory = await this.getInventory();

    if (inventory && inventory[item]) {
        inventory[item] += amount * 1;
    }
    else {
        inventory[item] = amount;
    }

    return DndData.findOneAndUpdate(null, { inventory: inventory }, { new: true }).exec();
}

module.exports.removeItem = async function (item, amount) {
    let inventory = await this.getInventory();

    if (inventory && inventory[item]) {
        const left = Math.max(0, inventory[item] - amount);
        if (left === 0) {
            delete inventory[item];
        }
        else {
            inventory[item] = left;
        }
    }

    return DndData.findOneAndUpdate(null, { inventory: inventory }, { new: true }).exec();
}

module.exports.clear = async function () {
    return DndData.findOneAndUpdate(null, { inventory: {} }, { new: true }).exec();
}