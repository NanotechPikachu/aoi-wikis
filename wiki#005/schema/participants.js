const mongoose = require('mongoose');

const participantsSchema = new mongoose.Schema({
    giveawayId: String,
    type: String,
    participants: { type: [String], default: [] },
});

module.exports = mongoose.model('Giveaway Participants', participantsSchema)