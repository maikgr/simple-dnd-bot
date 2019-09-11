const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Connection = mongoose.connection;
mongoose.connect(process.env.DATAKEY, { useNewUrlParser: true });

Connection.on('error', console.error.bind(console, 'data service connection error'));
Connection.on('connected', console.log.bind(console, 'connected to data service'));
Connection.on('disconnected', console.log.bind(console, 'disconnected from data service'));

let DataSchema = new Schema({
    guild: String,
    session:  String,
    dm: String,
    active: Boolean,
    inventory: Object
});

let DndData = mongoose.model('dnd-data', DataSchema, 'dnd-data')

async function get(guild) {
    return await DndData.findOne({ guild, active: true}).exec();
}

async function update(guild, inventory) {
    return await DndData.findOneAndUpdate({ guild, active: true}, { inventory }, { new: true }).exec();
}

module.exports.getInventory = async function (guild, user) {
    const inv = await get(guild);
    if (user) {
        return inv[user];
    }
    return inv.shared;
}

module.exports.addItem = async function (guild, item, amount, user) {
    let inv = await get(guild);
    let current = inv.shared;
    if (user) {
        current = inv[user];
    }
    
    if (current && current[item]) {
        current[item] += amount;
    }
    else {
        current[item] = amount;
    }

    let updatedInv = await update(guild, inv);
    if (user) {
        return updatedInv[user];
    }
    return updatedInv.shared;
}

module.exports.useItem = async function (guild, item, amount, user) {
    let inv = await get(guild);
    let current = inv.shared;
    if (user) {
        current = inv[user];
    }

    if (current && current[item]) {
        const left = Math.max(0, current[item] - amount);
        if (left === 0) {
            delete current[item];
        }
        else {
            current[item] = left;
        }
    }

    let updatedInv = await update(guild, inv);
    if (user) {
        return updatedInv[user];
    }
    return updatedInv.shared;
}

module.exports.clear = async function (guild, user) {
    let inv = await get(guild);
    if (user) {
        inv[user] = {};
    }
    else {
        inv.shared = {};
    }

    await update(guild, inv);
    return null;
}