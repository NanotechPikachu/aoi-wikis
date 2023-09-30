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
 let ro = 0;
  
 const emb = new EmbedBuilder()
       .setDescription("The process of role removal has been started. Please wait...")
       .setColor(0x008000);
  
 await int.reply({ embeds: [emb] }) 
 const start = Date.now() 
  
 const reason = "Role removed by $username";
  
guild.members.fetch()
   .then((data) => {
    data.forEach((member) => {
     const memHigh = member.roles.highest;
     if ( member.roles.cache.has(role.id) ) {
     if (
       userHigh.comparePositionTo(memHigh) > 0 
       && member.manageable
     ) { 
         try { 
             member.roles.remove(role.id, reason)
             suc += 1;
         } catch (err) { 
             console.error(err); 
             er += 1; 
         }
     } else { 
         er+=1; 
     }
     } else {
      ro+=1;
     }
 });
 const embed = new EmbedBuilder()
       .setTitle('Process Complete')
       .setDescription(\`- Role: <@&\${role.id}>\n- **Role removed from:** \${suc} members.\n- **Failed on:** \${er} members.\n- **No of members who does not have the role:** \${ro} members.\`)
       .setColor(0x008000)
       .setFooter({ text: \`Time taken: Around \${Math.floor((Date.now()-start)/1000)} seconds.\` });
 int.editReply({ embeds: [embed] }) 
  })
    .catch((e) => {
    console.error(e);
  });
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
    
$onlyIf[$interactionData[options._subcommand]==mass-remove;]
`
}]

/*
If any of you have ideas to make this code better, feel free to ping me or DM me.
*/