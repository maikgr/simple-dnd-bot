const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Connection = mongoose.connection;
mongoose.connect(process.env.APP_SETTING_DB, { useNewUrlParser: true });

Connection.on('error', console.error.bind(console, 'settings service connection error'));
Connection.on('connected', console.log.bind(console, 'connected to settings service'));
Connection.on('disconnected', console.log.bind(console, 'disconnected from settings service'));

const SettingsSchema = new Schema({
    channels: []
});

const Settings = mongoose.model('dnd-appsettings', SettingsSchema, 'dnd-appsettings')

module.exports.getSettings = function() {
    return Settings.findOne().exec();
}

module.exports.updateChannels = function (channels) {
    return Settings.findOneAndUpdate(null, { channels: channels }, { new: true }).exec();
}
