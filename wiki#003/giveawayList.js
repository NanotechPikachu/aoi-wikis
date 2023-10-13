module.exports = [{ 
     name: "giveaway list", 
     aliases: ["glist", "gw-list"], 
     code: ` 
 $djsEval[(async () => { 
 const { giveawaysList } = require('functions/giveawayManager.js'); 
 giveawaysList(message); 
 })(); 
 ] 
 $onlyPerms[manageguild;{newEmbed:{description:You do not have \`MANAGE_GUILD\` permission.}{color:Red}}] 
 ` 
 }]
