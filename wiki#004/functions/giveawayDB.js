// Importing the SCHEMAS
const Giveaway = require('../schema/giveaway.js');
const Participants = require('../schema/participants.js');

/*
  FUNCTION: addGiveaway()
  USAGE: To add a giveaway to MongoDB with its Data.
  PARAMS:
    'giveawayId': | Type: 'String' |
    'guildId': | Type: 'String' |
    'channelId': | Type: 'String' |
    'prize': | Type: 'String' |
    'endTime': | Type: 'Number' |
    'winnerCount': | Type: 'Number' |
    'hoster': | Type: 'String' |
*/

async function addGiveaway(giveawayId, guildId, channelId, prize, endTime, winnerCount, hoster) {
    await Giveaway.findOneAndUpdate(
        {
        	giveawayId: giveawayId,
            type: "giveaway"
        }, {
            $set: {
        		guildId: guildId, 
                status: "active",
       	 		channelId: channelId, 
        		prize: prize, 
        		endTime: endTime, 
        		winnerCount: winnerCount, 
        		hoster: hoster
    		}
        }, { upsert: true, new: true });
};

async function addParticipant(giveawayId, user) {
    await Participants.findOneAndUpdate(
        {
        	giveawayId: giveawayId,
            type: "giveaway-p"
        }, {
            $push: {
                participants: user
            }
        }, { upsert: true, new: true });
};

async function removeParticipant(giveawayId, user) {
    await Participants.findOneAndUpdate(
        {
        	giveawayId: giveawayId,
            type: "giveaway-p"
        }, {
            $pull: {
                participants: user
            }
        }, { upsert: true, new: true });
};

async function getParticipants(giveawayId) {
    const dat = await Participants.findOne(
      { 
          giveawayId: giveawayId,
          type: "giveaway-p"
      }
    ); 
    return dat?.participants;
};

async function getActiveGiveaways() {
    const dat = await Giveaway.find({
        type: "giveaway",
        status: "active"
    });
    return dat;
};

async function endGiveaway(giveawayId, channelId, status) {
    const gw = await Giveaway.findOne({
        giveawayId: giveawayId,
        type: "giveaway",
        channelId: channelId,
        status: "active"
    });
    if (!gw) return false;
    await Giveaway.findOneAndUpdate({
        giveawayId: giveawayId,
        type: "giveaway",
        channelId: channelId,
        status: "active"
    }, {
        $set: { status: status }
    });
    return true;
};

async function getGiveaway(giveawayId) {
    const a = await Giveaway.findOne({
        giveawayId: giveawayId,
        type: "giveaway"
    }); 
    return a;
};

async function fetchGiveaways(guildId, status) {
    const a = await Giveaway.find({
        type: "giveaway",
        status: status,
        guildId: guildId
    });
    if (!a || a.length === 0) return null;
    return a;
};

module.exports = {
    addGiveaway,
    addParticipant,
    getParticipants,
    removeParticipant,
    getActiveGiveaways,
    endGiveaway,
    getGiveaway,
    fetchGiveaways
};