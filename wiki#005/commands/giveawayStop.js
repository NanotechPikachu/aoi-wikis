module.exports = [{
    name: "giveaway",
    type: "interaction",
    prototype: "slash",
    code: `
$djsEval[(async () => {
const { stopGiveaway } = require(\`\${process.cwd()}/func/giveawayManager.js\`);
const channelId = "$slashOption[channel]";
const giveawayId = "$slashOption[giveaway_id]";
const int = d.data.interaction;
await int.deferReply({ ephemeral: true });
const a = await stopGiveaway(d, int?.guild?.id, giveawayId, channelId, "stopped");
int.followUp(\`\${a ? "Ended" : "Invalid giveaway ID / message not found / already ended!"}\`);
})();
]
$onlyIf[$interactionData[options._subcommand]==stop;]
`
}]