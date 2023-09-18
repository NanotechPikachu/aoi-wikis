module.exports = [{
    name: "role",
    type: "interaction",
    prototype: "slash",
    code: `
$djsEval[(async () => {
const { EmbedBuilder } = require('discord.js');
const rol = "$get[role]";
const guild = message.guild;
const role = guild.roles.cache.get(rol);
const int = d.data.interaction
const userHigh = int.member.roles.highest;

let suc = 0;
let er = 0;

const emb = new EmbedBuilder()
      .setDescription("The process of role adding has been started. Please wait...")
      .setColor(0x008000)

await int.reply({ embeds: [emb] })
const start = Date.now()

const reason = "Role added by "+int.user.username 

for (const member of guild.members.cache) {
    const memHigh = member[1].roles.highest;
    if (userHigh.comparePositionTo(memHigh)>0&&member[1].manageable) {
        try {
            member[1].roles.add(role, reason)
            suc+=1;
        } catch (err) {
            console.error(err);
            er+=1;
        }
    } else {
        er+=1;
    } 
    
}
const embed = new EmbedBuilder()
      .setDescription(\`**Process Complete**\n\n<@&\${role.id}> has been successfully added to \${suc} and failed on \${er} members\`)
      .setColor(0x008000)
      .setFooter({ text: \`Time taken: Around \${Math.floor((Date.now()-start)/1000)} seconds.\` })
await int.editReply({ embeds: [embed] })
})()
]

$onlyIf[$checkContains[$rolePerms[$get[role]; , ;$guildID];administrator]==false;{newEmbed:{description:You cannot do this operation on a role which has \`ADMINISTRATOR\` permission.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$isRoleManaged[$get[role]]==false;{newEmbed:{description:You cannot do this operation on a managed role.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$rolePosition[$userHighestRole[$authorID]]<$rolePosition[$get[role]];{newEmbed:{description:You cannot do the operation on a higher role than you.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$rolePosition[$userHighestRole[$clientID]]<$rolePosition[$get[role]];{newEmbed:{description:I cannot do the operation on a higher role than me.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyClientPerms[manageroles;{newEmbed:{description:I do not have \`MANAGE_ROLES\` permission.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyPerms[administrator;{newEmbed:{description:You do not have \`ADMINISTRATOR\` permission.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$let[role;$slashOption[role]]

$suppressErrors[Something went wrong!{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$onlyIf[$interactionData[options._subcommand]==mass-add;]
`
}]

/*
SOME IMPORTANT INFOS.

I am not a djs coder hence, the code may look little primitive or unconventional but, I can guarantee you 99% that it works. I have tested it around 50 times and it worked(though I got yelled by testing server mates for spam messages). 

The code doesn't count whether you have the role or not. For example, you wanna mass add a role named "X" and 5 out of 20 people in server has the role and 2 have role higher than bot, then it will say "Success in 18 and Failed on 2" as it won't count if member has that role or not.
*/