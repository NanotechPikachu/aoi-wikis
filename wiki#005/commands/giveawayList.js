module.exports = [{
    name: "giveaway",
    type: "interaction",   
    prototype: "slash",
    code: `
$djsEval[(async () => {
const { listGiveaways } = require(\`\${process.cwd()}/func/giveawayManager.js\`);
const type = "$slashOption[type]";

const int = d.data.interaction;
await int.deferReply({ ephemeral: false });
await listGiveaways(int, type);

})();
]

$onlyIf[$interactionData[options._subcommand]==list;]
`
}]