module.exports = [{
    name: "role",
    type: "interaction",
    prototype: "slash",
    code: `

$interactionReply[;{newEmbed:{title:Role info}{description:**Name#COLON#** $roleName[$get[role]] (<@&$get[role]>)\n**Color#COLON#** $get[color]\n**Members Count#COLON#** $roleMembersCount[$get[role]]\n**Created on#COLON#** <t#COLON#$get[date]#COLON#f>\n**Position#COLON#** $rolePosition[$get[role]]\n**Hoisted?** $toLocaleUpperCase[$isHoisted[$get[role]]]\n**Editable?** $toLocaleUpperCase[$isRoleEditable[$get[role]]]}{footer:ID#COLON# $get[role]}{color:$get[color]}}]

$let[date;$djsEval[
Math.floor(message.guild.roles.cache.get('$get[role]').createdAt.getTime() /1000);true]]

$let[color;$getRoleColor[$get[role]]]

$let[role;$slashOption[role]]

$suppressErrors[Something went wrong!{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$interactionData[options._subcommand]==info;]
`
}]
