module.exports = [{
    name: "role",
    type: "interaction",
    prototype: "slash",
    code: `
$interactionReply[;{newEmbed:{description:<@&$get[role]> has been removed from <@$get[user]>}{timestamp}{color:Green}{footer:Moderator#COLON# $username:$authorAvatar}}]
    
$removeRole[$guildID;$get[user];$get[role];Role removed by $username]
    
$onlyIf[$rolePosition[$userHighestRole[$authorID]]<=$rolePosition[$userHighestRole[$get[user]]];{newEmbed:{description: Given user has higher role than you.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$onlyIf[$rolePosition[$userHighestRole[$clientID]]<$rolePosition[$get[role]];{newEmbed:{description:The role you wanna me to remove has higher position than my highest role.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$onlyIf[$rolePosition[$userHighestRole[$authorID]]<$rolePosition[$get[role]];{newEmbed:{description:The role you wanna me to remove has higher position than you.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$onlyIf[$hasRoles[$guildID;$get[user];$get[role]]==true;{newEmbed:{description:The user does not have the given role.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$onlyIf[$isRoleManaged[$get[role]]==false;{newEmbed:{description:The role given is managed. You cannot remove this role.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$onlyIf[$hasPerms[$guildID;$clientID;manageroles]==true;I do not have \`MANAGE_ROLES\` permission.{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$onlyPerms[manageroles;You do not have \`MANAGE_ROLES\` permission.{options:{ephemeral:true}}{extraOptions:{interaction:true}}]
    
$let[role;$slashOption[role]]
    
$let[user;$slashOption[user]]
    
$suppressErrors[Something went wrong!{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$interactionData[options._subcommand]==remove;]
`
}]
