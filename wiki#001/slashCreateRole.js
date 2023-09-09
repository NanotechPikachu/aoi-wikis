module.exports = [{
    name: "create role cmd",
    code: `
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
}
]
]

$onlyIf[$authorID==$clientOwnerIDs;]
`
}]
