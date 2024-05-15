module.exports = [{
    name: "giveaway auto stop",
    type: "loop",
    channel: "1123543013470240788", // CHANGE IT TO YOUR ERROR CHANNEL
    executeOnStartup: true,
    every: 10 * 1000,
    code: `
$djsEval[(async () => {
const { stopGiveaway } = require(\`\${process.cwd()}/func/giveawayManager.js\`);
 const { getActiveGiveaways } = require(\`\${process.cwd()}/func/giveawayDB.js\`);

 const g = await getActiveGiveaways();
 if (!g) return;
 for (const obj of g) {
   const t = obj?.endTime;
   if (!t) continue;
   if (t && Date.now() >= t) {
     await stopGiveaway(d, obj?.guildId, obj?.giveawayId , obj?.channelId, "ended"); 

   } else {
     continue;
   };
 };
})();
]
`
}]