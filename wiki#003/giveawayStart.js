module.exports = [{
    name: "giveaway start",
    aliases: ["gstart", "giveaway-start"],
    code: `
$djsEval[(async () => {
const { startGiveaway } = require('/giveawayManager.js');

const prize = "$messageSlice[2]";
const duration = '$message[1]';
const winnersCount = "$message[2]";

startGiveaway(prize, duration, message, winnersCount);

})();
]

$onlyIf[$message[2]>0;{newEmbed:{description:Enter a number greater than 0.}{color:Red}}]
$onlyIf[$isNumber[$message[1]]==false;{newEmbed:{description:Enter time in parsable format like \`1m/1h/1d\`.}{color:Red}}]
$onlyIf[$parseTime[$message[1]]!=-1;{newEmbed:{description:Enter a valid parsable time.}{color:Red}}]
$onlyIf[$messageSlice[2]!=;{newEmbed:{description:Enter a prize for the giveaway.}{color:Red}}]
$onlyIf[$isNumber[$message[2]]==true;{newEmbed:{description:Enter a valid numberical value for number of winners.}{color:Red}}]
$onlyIf[$message[2]!=;{newEmbed:{description:Enter number of winners.}{color:Red}}]
$onlyIf[$message[1]!=;{newEmbed:{description:Enter a valid time.}{color:Red}}]
$onlyPerms[manageguild;{newEmbed:{description:You do not have \`MANAGE_GUILD\` permission.}{color:Red}}]
$suppressErrors[Something went wrong ]
`
}]

