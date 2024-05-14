const { 
      Client, 
      Collection, 
      GatewayIntentBits 
    } = require('discord.js');
const mongoose = require('mongoose');

// Discord BOT_TOKEN
const { 
      token,
      mongo_uri 
    } = require('./config.json');

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers
] });

/*
  Add your Events setup and slash command handling here...
  I am using the setup given by discord.js guide aka "https://discordjs.guide/"
  Refer it and if you are using a different setup for slash handling, please edit the slash code as such!
*/

// MONGO_DB connection
mongoose.connect(mongo_uri)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log(`DB connection failed: ${err}`));

// Import some necessary GIVEAWAY_FUNCTION

const { stopGiveaway } = require('./functions/giveawayManager.js');
const { getActiveGiveaways } = require('./functions/giveawayDB.js');

// 'ready' event used for checking if a giveaway has to be ended or not every 10 seconds
client.on('ready', async (client) => {
    setInterval(() => {
        try {
            const g = getActiveGiveaways().then((g) => { 
            if (!g) return;
            for (const obj of g) {
                const t = obj?.endTime;
                if (!t) continue;
                if (t && Date.now() >= t) {
                    stopGiveaway(client, obj?.guildId, obj?.giveawayId, obj?.channelId, "ended");
                };
            }
           })
        } catch (err) {
            console.error(`Error in giveaway auto stop: ${err}`);
        }
    }, 10 * 1000); 
});


// CLIENT_LOGIN
client.login(token);