const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Connection = mongoose.connection;
mongoose.connect(process.env.CONNSTR, { useNewUrlParser: true });

Connection.on('error', console.error.bind(console, 'db service connection error'));
Connection.on('connected', console.log.bind(console, 'connected to db service'));
Connection.on('disconnected', console.log.bind(console, 'disconnected from db service'));

const SettingsSchema = new Schema({
    channels: []
});

const Settings = mongoose.model('dnd', SettingsSchema, 'dnd')

module.exports.getSettings = function() {
    return Settings.findOne(null).exec();
}

module.exports.updateChannels = function (channels) {
    return Settings.findOneAndUpdate(null, { channels: channels }, { new: true }).exec();
}
