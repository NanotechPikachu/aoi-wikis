# Wiki #NP003 - Giveaway System

This is a wiki or snippet of the **giveaway system** made by me.

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


