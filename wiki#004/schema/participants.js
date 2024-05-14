const mongoose = require('mongoose');

// GIVEAWAY_PARTICIPANTS_SCHEMA_TO_MONGO
const participantsSchema = new mongoose.Schema({
    giveawayId: String,
    type: String,
    participants: { type: [String], default: [] },
});

module.exports = mongoose.model('Giveaway Participants', participantsSchema)