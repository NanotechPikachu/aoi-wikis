module.exports = [{
    name: "giveaway",
    type: "interaction",    
    prototype: "slash",
    code: `
$djsEval[(async () => {
const { infoGiveaway } = require(\`\${process.cwd()}/func/giveawayManager.js\`);
const giveawayId = "$slashOption[giveaway_id]";
const int = d.data.interaction;
await int.deferReply({ ephemeral: false });
await infoGiveaway(int, giveawayId);

})();
]

$onlyIf[$interactionData[options._subcommand]==info;]
`
}]