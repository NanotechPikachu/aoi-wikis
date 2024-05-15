module.exports = [{
     name: "giveaway",
     type: "interaction",
     prototype: "slash",
     code: `
 $interactionReply[Giveaway Created;;;;everyone;true]
 $djsEval[(async () => {
 const { startGiveaway } = require(\`\${process.cwd()}/func/giveawayManager.js\`);

 const prize = '$slashOption[prize]';
 const duration = '$slashOption[duration]';
 const winnersCount = '$slashOption[winners]';
 const host = '$slashOption[host]';
 const channelId = '$slashOption[channel]';
 const int = d.data.interaction;

 await startGiveaway(prize, duration, int, winnersCount, host, channelId);

  })();
  ]

$onlyIf[$interactionData[options._subcommand]==start;]
  `
}, {
    name: "join-gw",
    type: "interaction",
    prototype: "button",
    code: `

 $djsEval[(async () => {
 const { participant } = require(\`\${process.cwd()}/func/giveawayManager.js\`);
d.data.interaction.deferReply({ ephemeral: true });
 const p = await participant(d.data.interaction);
 
 d.data.interaction.followUp( \`You have \${p ? "entered" : "exited"} the giveaway\`);
 
})();
]
`
}]