// Importing required functions and modules
const { parseDuration } = require('./parseDuration.js');
const { 
    addGiveaway, 
    addParticipant,
    getParticipants,
    removeParticipant,
    getActiveGiveaways,
    endGiveaway,
    getGiveaway,
    fetchGiveaways
      } = require('./giveawayDB.js');
const {
    ComponentType, 
    EmbedBuilder, 
    ActionRowBuilder,
    ButtonBuilder, 
    ButtonStyle 
      } = require('discord.js');