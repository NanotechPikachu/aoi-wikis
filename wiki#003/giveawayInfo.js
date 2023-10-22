module.exports = {
    name: "giveaway info",
    aliases: ["ginfo", "gw-info"],
    code: `
$djsEval[(async () => {
const { giveawayInfo } = require('/home/container/functionsJS/giveawayManager.js');

const giveawayId = "$message[1]";

giveawayInfo(giveawayId, message);
})();
]

$onlyIf[$isNumber[$message[1]]==true;{newEmbed:{description:Enter a valid message ID of giveaway}{color:Red}}]
$onlyPerms[manageguild;{newEmbed:{description:You do not have \`MANAGE_GUILD\` permission.}{color:Red}}]
$suppressErrors[Something went wrong ]
`
}
