module.exports = [{
    name: "giveaway",
    type: "interaction",
    prototype: "slash",
    code: `
$djsEval[(async () => {
const { rerollGiveaway } = require(\`\${process.cwd()}/func/giveawayManager.js\`);
const channelId = "$slashOption[channel]";
const giveawayId = "$slashOption[giveaway_id]";
const count = parseInt("$slashOption[winners]");
const int = d.data.interaction;
await int.deferReply({ ephemeral: true });
const a = await rerollGiveaway(int, giveawayId, channelId, count);
int.followUp(\`\${a ? "Rerolled" : "Invalid giveaway ID / message not found / un-rerollable!"}\`);
})();
]
$onlyIf[$interactionData[options._subcommand]==reroll;]
`
}]