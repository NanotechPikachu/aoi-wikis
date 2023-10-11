module.exports = [{ 
     name: "giveaway reroll", 
     aliases: ["gw-reroll", "greroll"], 
     code: ` 
 $djsEval[(async () => { 
 const { rerollGiveaway } = require('/home/container/giveawayManager.js'); 
 const giveawayId = "$message[1]"; 
 const winnersCount = "$message[2]"; 
  
 rerollGiveaway(giveawayId, winnersCount, message); 
 })(); 
 ] 
  
 $onlyIf[$message[2]>0;{newEmbed:{description:Enter number of winners greater than 0}{color:Red}}] 
 $onlyIf[$isNumber[$message[2]]==true;{newEmbed:{description:Enter a valid number of winners}{color:Red}}] 
 $onlyIf[$isNumber[$message[1]]==true;{newEmbed:{description:Enter a valid message ID of giveaway}{color:Red}}] 
 $onlyPerms[manageguild;{newEmbed:{description:You do not have \`MANAGE_GUILD\` permission.}{color:Red}}] 
 $suppressErrors[Something went wrong ] 
 ` 
 }]
