# Wiki #NP005 - Giveaway System(AOI) - Better

This is a wiki or snippet of the **giveaway system** made by me ONLY FOR AOI.JS BOTS.


### Features

- giveaway start
- giveaway end(on timeout)
- giveaway end(on command)
- storage of data in DB - MongoDB
- giveaway reroll
- giveaway list(active, ended, cancelled, stopped)
- giveaway cancel
- giveaway info
- DM winner

### Installations Needed

```bash
npm install aoi.js
npm install discord.js
npm install mongoose
```

> [!NOTE]
> This code works **only for AoiJS Bots.**. 
> This has been tested on aoi.js - v6.7.1 and mongoose - v8.3.2

<hr />

### Slash command

Here is the basic slash command for this giveaway system!

```js
$createApplicationCommand[global;giveaway;Giveaway Commands;true;true;slash;[
  {
  "name": "start",
    "description": "Start a giveaway",
    "type": 1,
    "options": [
      {
        "name": "channel",
        "description": "Mention the channel to start the giveaway.",
        "required": true,
        "type": 7
      },
      {
        "name": "duration",
        "description": "Duration of the giveaway like 1m/1w",
        "required": true,
        "type": 3
      },
 {
        "name": "prize",
        "description": "Prize of the giveaway.",
        "required": true,
        "type": 3
      },
 {
        "name": "winners",
        "description": "No. of winners of the giveaway.",
        "required": true,
        "type": 4
      },
 {
        "name": "host",
        "description": "Host of the giveaway.",
        "required": true,
        "type": 3
      }
    ]
  }, {
 "name": "stop",
    "description": "Stop a giveaway",
    "type": 1,
    "options": [
      {
        "name": "channel",
        "description": "Mention the channel of the giveaway.",
        "required": true,
        "type": 7
      },
      {
        "name": "giveaway_id",
        "description": "Mention the giveaway message ID.",
        "required": true,
        "type": 3
    }]
}, {
 "name": "cancel",
    "description": "Cancel a giveaway",
    "type": 1,
    "options": [
      {
        "name": "channel",
        "description": "Mention the channel of the giveaway.",
        "required": true,
        "type": 7
      },
      {
        "name": "giveaway_id",
        "description": "Mention the giveaway message ID.",
        "required": true,
        "type": 3
    }]
}, {
 "name": "reroll",
    "description": "Reroll a giveaway",
    "type": 1,
    "options": [
      {
        "name": "channel",
        "description": "Mention the channel of the giveaway.",
        "required": true,
        "type": 7
      },
      {
        "name": "giveaway_id",
        "description": "Mention the giveaway message ID.",
        "required": true,
        "type": 3
    }, {
        "name": "winners",
        "description": "No of people to reroll.",
        "required": true,
        "type": 4
}]
}, {
 "name": "list",
    "description": "List giveaways",
    "type": 1,
    "options": [
      {
        "name": "type",
        "description": "Type of giveaway to list.",
        "required": true,
        "type": 3,
       "choices": [{
"name": "Active Giveaways",
"value": "active"
}, {
"name": "Ended Giveaways",
"value": "ended"
}, {
"name": "Cancelled Giveaways",
"value": "cancelled"
}, {
"name": "Stopped Giveaways",
"value": "stopped"
}]
}]
}, {
 "name": "info",
    "description": "Get giveaway info.",
    "type": 1,
    "options": [

      {
        "name": "giveaway_id",
        "description": "Mention the giveaway message ID.",
        "required": true,
        "type": 3
    }]
}
]]

```


<hr />


If you have any doubts or errors, feel free to contact me in discord [@nanotechpikachu](https://discord.com/users/949588732498018324)

Happy coding!!!