const db = require('./settings-client');

let channels = [];

async function initialize() {
    const settings = await db.getSettings();
    channels = settings && settings.channels;
}

module.exports.getChannels = function () {
    initialize();
    return channels;
}

module.exports.addChannel = async function (channelId) {
    channels.push(channelId);
    const settings = await db.updateChannels(channels);
    channels = settings.channels;
}

module.exports.removeChannel = async function (channelId) {
    const chIndex = channels.indexOf(channelId);
    if (chIndex > -1) {
        channels.splice(chIndex, 1);
    }
    const settings = await db.updateChannels(channels);
    channels = settings.channels;
}

initialize();