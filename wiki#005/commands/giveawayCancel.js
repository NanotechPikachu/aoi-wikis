module.exports = [{
    name: "giveaway",
    type: "interaction",
    prototype: "slash",
    code: `
$djsEval[(async () => {
const { cancelGiveaway } = require(\`\${process.cwd()}/func/giveawayManager.js\`);
const channelId = "$slashOption[channel]";
const giveawayId = "$slashOption[giveaway_id]";
const int = d.data.interaction;
await int.deferReply({ ephemeral: true });
const a = await cancelGiveaway(int, channelId, giveawayId);
int.followUp(\`\${a ? "Cancelled" : "Invalid giveaway ID / message not found / already ended!"}\`);
})();
]
$onlyIf[$interactionData[options._subcommand]==cancel;]
`
}]