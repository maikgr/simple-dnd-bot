const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Connection = mongoose.connection;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

Connection.on('error', console.error.bind(console, 'inventory connection error'));
Connection.on('connected', console.log.bind(console, 'connected to inventory'));
Connection.on('disconnected', console.log.bind(console, 'disconnected from inventory'));

let InventorySchema = new Schema({
  name: String,
  money: Number,
  items: Array
});

let inventories = mongoose.model('inventory', InventorySchema);

module.exports.inventories = inventories;