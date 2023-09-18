# Wiki #NP001 - Role Commands(Slash)

This is a wiki or snippet of the **role commands.** This included the following commands under it which are all **slash commands**.
- role add
- role remove
- role info
- role remove-all
- role create
- role mass-add

## Commands
Here are the information about the commands in it.

### Role Add
As the name implies, this is a slash command which adds role to the entered user along with extensive conditions to check role hierarchy, permission factors, etc.

![roleAdd.js](https://cdn.discordapp.com/attachments/1149961478372347985/1149964754278957116/Screenshot_20230909_123819_Discord.jpg)

### Role Remove
This is a slash command which removes entered role from entered user.

![roleRemove.js](https://cdn.discordapp.com/attachments/1149961478372347985/1149964767738466304/Screenshot_20230909_123832_Discord.jpg)

### Role Info
This will return an embed message with the information of a role like role name, role position, creation date, manageable, etc.

![roleInfo.js](https://cdn.discordapp.com/attachments/1149961478372347985/1149961523784077362/Screenshot_20230909_122607_Discord.jpg)

### Role Remove-All
This is a slash command which removes **all roles from a selected user.** Yeah, it removes all of their roles hence, the condition to use is to have role higher than the highest role of the user whose role you wanna remove. Also, you can't use this command on a bot cuz one of their role is managed which will cause an error.

![roleRemoveAll.js](https://cdn.discordapp.com/attachments/1149961478372347985/1149964783781691452/Screenshot_20230909_123902_Discord.jpg)

### Role Create
This is a slash command which creates a role. This has options to enter name, color(hex value), hoist, mentionable. 

![roleCreate.js](https://cdn.discordapp.com/attachments/1149961478372347985/1150605772141633566/Screenshot_20230911_070620_Discord.jpg)

### Role Mass-Add
As the name implies, it's a slash command which adds a role to all the members of a guild(subjective to conditions like role hierarchy, etc). The code comes with extensive error handlers and other things like role position checker, admin permission check, permission check, etc.

_(Do check the commentted out portion of the code file as it contains important information.)_

![roleMassAdd.js](https://cdn.discordapp.com/attachments/1149961478372347985/1153328507494080593/Screenshot_20230918_192529_Discord.jpg)


**Note**: All the commands are accompanied with error checking and permission checks.

### Slash Create
I have also made the `$createApplicationCommand` to a normal prefix command and added to the repository. You can either do the same or use `$eval` ro eval the code and do the same. Also, just replace `$guildID` with `global` to create a global slash command.

## Credits 
I will also extend my thanks to the following people who helped me here.
- ahoemi
- SrPandi
- fafa
- shadowvirtual

Thanks for reading!