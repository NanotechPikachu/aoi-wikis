const { AoiClient } = require("aoi.js");
const mongoose = require('mongoose');

// Discord BOT_TOKEN
const { 
      token,
      mongo_uri 
    } = require('./config.json');

// AOI_CLIENT SETUP
const client = new AoiClient({
    token: token,
    prefix: "BOT_PREFIX",
    intents: ["MessageContent", "Guilds", "GuildMessages", "GuildMembers"],
    events: ["onMessage", "onInteractionCreate"],
    database: {
        type: "aoi.db",
        db: require("@akarui/aoi.db"),
        dbType: "KeyValue",
        tables: ["main"],
        securityKey: "a-32-characters-long-string-here"
    }
});

client.loadCommands("./commands/", true);

// MONGO_DB CONNECTION 
mongoose.connect(mongo_uri)
    .then(() => console.log("DB connected!"))
    .catch((err) => console.log(`DB connection failed: ${err}`));