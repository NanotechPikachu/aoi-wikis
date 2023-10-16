module.exports = {
    name: "giveaway cancel",
    aliases: ["gcancel", "gw-cancel"],
    code: `
$djsEval[(async () => {
const { cancelGiveaway } = require('functions/giveawayManager.js');

const giveawayId = "$message[1]";
const reason = "$messageSlice[1]";

cancelGiveaway(giveawayId, reason, message);
})();
]
$onlyIf[$messageSlice[1]!=;{newEmbed:{description:Please enter a valid reason for cancellation of Giveaway.}{color:Red}}]
$onlyIf[$isNumber[$message[1]]==true;{newEmbed:{description:Please enter a valid message ID}{color:Red}}]
$onlyPerms[manageguild;{newEmbed:{description:You do not have \`MANAGE_GUILD\` permission.}{color:Red}}]
$suppressErrors[Something went wrong!]
`
}
