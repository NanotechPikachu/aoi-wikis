module.exports = [{
    name: "role",
    type: "interaction",
    prototype: "slash",
    code: `
$interactionReply[;{newEmbed:{description:Are you sure that you wanna remove all roles from <@$get[user]>?}{color:Random}};{actionRow:{button:Sure:danger:acceeept_$get[user]_$authorID:false}{button:Cancel:secondary:canceeel_$authorID:false}}]

$onlyIf[$rolePosition[$userHighestRole[$authorID]]<$rolePosition[$userHighestRole[$get[user]]];{newEmbed:{description:The user has higher position than your highest role.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$rolePosition[$userHighestRole[$clientID]]<$rolePosition[$userHighestRole[$get[user]]];{newEmbed:{description:The user has higher position than my highest role.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$isBot[$get[user]]==false;{newEmbed:{description:Cannot use this command on a bot!}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$hasPerms[$guildID;$clientID;manageroles]==true;{newEmbed:{description:I do not have \`MANAGE_ROLES\` permission.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyPerms[manageroles;{newEmbed:{description:You do not have \`MANAGE_ROLES\` permission.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$let[user;$slashOption[user]]

$onlyIf[$interactionData[options._subcommand]==remove-all;]
`
}, {
    type: "interaction",
    prototype: "button",
    code: `
$interactionUpdate[;{newEmbed:{description:Successfully removed all roles from <@$get[user]>!}{color:Green}{timestamp}{footer:Moderator#COLON# $username:$userAvatar[$authorID]}}]

$djsEval[
const memberId = "$get[user]";
const member = guild.members.cache.get(memberId);
if (member) {
    member.roles.set([])
}
;false]

$let[user;$advancedTextSplit[$interactionData[customId];_;2]]

$onlyIf[$advancedTextSplit[$interactionData[customId];_;3]==$interactionData[author.id];{newEmbed:{description:Only the author can use this button!}{color:Red}}{options:{ephemeral}}{extraOptions:{interaction}}]

$onlyIf[$advancedTextSplit[$interactionData[customId];_;1]==acceeept;]  
`
}, {
    type: "interaction",
    prototype: "button",
    code: `

$interactionUpdate[;{newEmbed:{description:Process cacelled by user.}{color:Red}}]

$onlyIf[$advancedTextSplit[$interactionData[customId];_;2]==$interactionData[author.id];{newEmbed:{description:Only the author can use this button!}{color:Red}}{options:{ephemeral}}{extraOptions:{interaction}}]

$onlyIf[$advancedTextSplit[$interactionData[customId];_;1]==canceeel;]    
`
}]
