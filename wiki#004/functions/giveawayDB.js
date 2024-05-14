// Importing the SCHEMAS
const Giveaway = require('../schema/giveaway.js');
const Participants = require('../schema/participants.js');

/*
  FUNCTION: addGiveaway()
  USE: To add a giveaway to MongoDB with its Data.
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

/*
  FUNCTION: addParticipant()
  USE: To add a participant(user) to MongoDB data of the giveaway.
  PARAMS:
    'giveawayId': | Type: 'String' |
    'user': | Type: 'String' |
*/

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

/*
  FUNCTION: removeParticipant()
  USE: To remove a participant(user) to MongoDB data of the giveaway.
  PARAMS:
    'giveawayId': | Type: 'String' |
    'user': | Type: 'String' |
*/

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

/*
  FUNCTION: getParticipants()
  USE: To get the participants of a giveaway from MongoDB.
  PARAMS:
    'giveawayId': | Type: 'String' |
*/

async function getParticipants(giveawayId) {
    const dat = await Participants.findOne(
      { 
          giveawayId: giveawayId,
          type: "giveaway-p"
      }
    ); 
    return dat?.participants;
};

/*
  FUNCTION: getActiveGiveaways()
  USE: To get an Array of active giveaways from MongoDB.
  PARAMS:
    !N/A!
*/

async function getActiveGiveaways() {
    const dat = await Giveaway.find({
        type: "giveaway",
        status: "active"
    });
    return dat;
};

/*
  FUNCTION: endGiveaway()
  USE: To end a giveaway by editing the status in MongoDB data.
  PARAMS:
    'giveawayId': | Type: 'String' |
    'channelId': | Type: 'String' |
    'status': | Type: 'String' | Choices: ['stopped', 'ended', 'active(not applicable here)', 'cancelled'] |
*/

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

/*
  FUNCTION: getGiveaway()
  USE: To get a giveaway data from MongoDB using giveawayId.
  PARAMS:
    'giveawayId': | Type: 'String' |
*/

async function getGiveaway(giveawayId) {
    const a = await Giveaway.findOne({
        giveawayId: giveawayId,
        type: "giveaway"
    }); 
    return a;
};

/*
  FUNCTION: fetchGiveaways()
  USE: To fetch all giveaways available in a guild respective to their status from MongoDB which returns an Array.
  PARAMS:
    'guildId': | Type: 'String' |
    'status': | Type: 'String' | Choices: ['stopped', 'ended', 'active', 'cancelled'] |
*/

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