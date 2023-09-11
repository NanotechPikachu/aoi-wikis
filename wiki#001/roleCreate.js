module.exports = {
    name: "role",
    type: "interaction",
    prototype: "slash",
    code: `

$djsEval[(async () => {
const { EmbedBuilder } = require('discord.js');
const name = '$get[name]';
const hoist = '$get[hoist]';
const ment = '$get[ment]';
const color = '$get[color]';

let hoi = '';
let men = '';
let col = '';

const int = d.data.interaction

if (hoist == '') {
    hoi = false;
} else if (hoist == 'false') {
    hoi = false;
} else {
    hoi = true;
}

if (ment == '') {
    men = false;
} else if (ment == 'false') {
    men = false;
} else {
    men = true;
}

if (color == '') {
    col = '#000000';
} else {
    col = color
}

const co = col.replace('#', '');
var regex = /[0-9A-Fa-f]{6}/g;
const check = col.includes('#');
try {
if (co.match(regex)&&check) {
const role = guild.roles.create({
    name: name,
    color: col,
    hoist: hoi,
    mentionable: men,
    position: 1,
    permission: ["SendMessages"]
})
    
const embed = new EmbedBuilder()
     .setTitle("Role created!")
     .setDescription(\`**Name:** \${name}\n**Color:** \${col}\n**Hoisted?** \${hoi}\n**Mentionable?** \${men}\`)
     .setColor(0xFF0000)
     .setTimestamp()

int.reply({ embeds: [embed] })

} else {
const em = new EmbedBuilder()
      .setDescription('Invalid Hex Value Entered. Enter a value like \`#FF0000\`')
      .setColor(0xFF0000)
      
    int.reply({ embeds: [em], ephemeral: true })
}
} catch (err) {
    console.error(err)
    int.reply({ content: "An error encountered", ephemeral: true })
}
})()
]


$let[ment;$slashOption[mentionable]]
$let[name;$slashOption[name]]
$let[hoist;$slashOption[hoist]]
$let[color;$slashOption[color]]

$onlyClientPerms[manageroles;{newEmbed:{description:I do not have \`MANAGE_ROLES\` permission.}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyPerms[manageroles;{newEmbed:{description:You do not have \`MANAGE_ROLES\` permission}{color:Red}}{options:{ephemeral:true}}{extraOptions:{interaction:true}}]

$onlyIf[$interactionData[options._subcommand]==create;]
`
}


/*
I have done this in discord.js since I thought this would be better suited in djs. You can do the same in aoi using $if: "old" but, I am not a fan of it.

Also, i would like to extend my heartfelt thanks to @ahoemi and @fafa who helped me in this code.
*/