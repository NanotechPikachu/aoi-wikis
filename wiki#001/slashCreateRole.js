module.exports = [{
    name: "create role cmd",
    code: `
$sendMessage[created]
$createApplicationCommand[$guildID;role;Role commands;true;slash;[
{
    "name": "add",
    "description": "Adds a role to the user.",
    "type": 1,
    "options": [
    {
        "name": "user",
        "description": "The user whom the role should be added to.",
        "required": true,
        "type": 6
    }, {
        "name": "role",
        "description": "The role you wanna assign to the user.",
        "required": true,
        "type": 8
    }
    ]
}, {
    "name": "remove",
    "description": "Removes a role from the user.",
    "type": 1,
    "options": [
    {
        "name": "user",
        "description": "The user whose role must be removed.",
        "required": true,
        "type": 6
    }, {
        "name": "role",
        "description": "The role which you wanna remove.",
        "required": true,
        "type": 8
    }
    ]
}, {
    "name": "info",
    "description": "Gives information about a role.",
    "type": 1,
    "options": [
    {
        "name": "role",
        "description": "The role whose info is needed.",
        "required": true,
        "type": 8
    }
    ]
}, {
    "name": "remove-all",
    "description": "Removes all roles from a user.",
    "type": 1,
    "options": [
    {
        "name": "user",
        "description": "The user whose all roles should be removed.",
        "required": true,
        "type": 6
    }
    ]
}, {
    "name": "create",
    "description": "Creates a role.",
    "type": 1,
    "options": [{
        "name": "name",
        "description": "Name of the role.",
        "required": true,
        "type": 3
    }, {
        "name": "color",
        "description": "Color of the role.",
        "type": 3
    }, {
        "name": "hoist",
        "description": "Wanna the role to be hoisted?",
        "type": 5
    }, {
        "name": "mentionable",
        "description": "Wanna role to be mentionable?",
        "type": 5
    }]
}, {
    "name": "mass-add",
    "description": "Adds a role to all possible members of the guild.",
    "type": 1,
    "options": [{
        "name": "role",
        "description": "The role which you wanna mass add.",
        "required": true,
        "type": 8
    }]
}
]
]

$onlyIf[$authorID==$clientOwnerIDs;]
`
}]