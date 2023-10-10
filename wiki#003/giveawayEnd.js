
module.exports = [{
    name: "giveaway end",
    aliases: ["gw-end", "gend"],
    code: `
$djsEval[(async () => {
const { stopGiveaway } = require('functions/giveawayManager.js');
const giveawayId = "$message[1]";

stopGiveaway(giveawayId, message);
})();
]

$onlyIf[$isNumber[$message[1]]==true;{newEmbed:{description:Enter a valid message ID of giveaway}{color:Red}}]
$onlyPerms[manageguild;{newEmbed:{description:You do not have \`MANAGE_GUILD\` permission.}{color:Red}}]
$suppressErrors[Something went wrong ]
`
}]
