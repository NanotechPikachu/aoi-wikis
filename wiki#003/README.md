# Wiki #NP003 - Giveaway System

This is a wiki or snippet of the **giveaway system** made by me.

[WEBSITE](https://nanotech-wikis.ver el.app/code/giveaway)

### Current features(V3.2)

- giveaway start
- giveaway end(on timeout)
- giveaway end(on command)
- storage of data in DB

### Installations Needed

```bash
npm install aoi.js
npm install @akarui/aoi.parser
npm install discord.js
npm install sqlite3
```

> [!IMPORTANT]
> All these codes and tested and run on discord.js - v14, @akarui/aoi.parser - v1.0.1, aoi.js - v6.5.6 and sqlite3 - v5.1.6. Hence, I am not giving you any promise of the working of this code if your package versions are higher/lower than the mentioned.

### Code

The code is split into __two parts__. 
1. The literal aoi.js code 
1. The discord.js functions

Both of them are essential for the giveaway system to work and the functions are the most important or the backbone of the code.

You have to put all the files in the `functions` folder of this repo to any other folder than the `commands` folder where you put aoi commands in your host. The other files like `giveawayStart.js` and `giveawayEnd.js` should be put in the normal `commands` folder.

> [!NOTE]
> The functions will be imported or called into our code. As such we use the `require()`. But, I only have given you an example of the require and hence, you need to change the file path of the require for the code to work as per your hosting service. **THE GIVEN PATH WON'T WORK!**

### Table

Giveaway Start:

| Option | Type | Example |
| ------ | ---- | ------- |
| Time | Parsable Time | `1m/1d/1h/1w` |
| Winners | Number | Any natural number |
| Prize | String | Nitro basic, boost, etc |

**Syntax**: `giveaway start {time} {winners} {prize}`

Giveaway End:

| Option | Type | Example |
| ------ | ---- | ------- |
| messageID | Number | A valid message ID |

**Syntax**: `giveaway end {messageID}`

### Image Gallery

On Start:

![giveawayStart](https://cdn.discordapp.com/attachments/1149961478372347985/1160100749250928721/Screenshot_20231007_115540_Discord.jpg)

On End:

![GiveawayEnd](https://cdn.discordapp.com/attachments/1149961478372347985/1160100773519183912/Screenshot_20231007_115554_Discord.jpg)

That's all for now.

But don't go anywhere as the project is still on and more functions will come soon as I have much more in my To-Do list.


