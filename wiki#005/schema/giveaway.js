const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    giveawayId: String,
    type: String,
    status: String,
    guildId: String,
    channelId: String,
    prize: String,
    endTime: Number,
    winnerCount: Number,
    hoster: String,
});

module.exports = mongoose.model('Giveaway', giveawaySchema)