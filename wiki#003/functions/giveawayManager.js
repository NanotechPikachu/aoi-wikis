const { parseDuration } = require('functions/parseDuration.js');
const { addGiveaway, addUserToGiveawayDB, fetchParticipantsFromDB, deleteGiveaway, getGiveawayDetails, removeWinnersFromDB, getAllGiveawaysInfo, fetchParticipantsAll, getActiveGiveaways, getEndedGiveaways, deletePermanentDB } = require('/home/container/functionsJS/giveawayDB.js');
const { EmbedBuilder } = require('discord.js');

//Start the giveaway 
async function startGiveaway(prize, duration, message, winnersCount, host) {
  const em = new EmbedBuilder()
        .setTitle('Giveaway!')
        .setDescription(`**Giveaway Prize:** ${prize}\n**Winner(s):** ${winnersCount}\n**Host:** <@${host}>\n**Ends on:** <t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:f> (<t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:R>)\n\nReact 🎉 to join!`)
        .setColor(0xFFA500)
  const giveawayMessage = await message.channel.send({ embeds: [em] });
  giveawayMessage.react('🎉');

  const endTime = Date.now() + parseDuration(duration);
  const guildId = message.guild.id;
  const channelId = message.channel.id;

  addGiveaway(giveawayMessage.id, guildId, channelId, prize, endTime, winnersCount)

  // Create a reaction collector for the giveaway message
  const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot;
  const collector = giveawayMessage.createReactionCollector({ filter, time: parseDuration(duration) });

  collector.on('collect', (reaction, user) => {
    addUserToGiveawayDB(giveawayMessage.id, user.id)
});

  collector.on('end', async (collected, reason) => {
    try {
    const details = await getGiveawayDetails(giveawayMessage.id);

    if (!details) {
      return
    }
    
    if (!giveawayMessage) {
      return message.channel.send('Giveaway Message not found!')
    }

    const participantsArray = await fetchParticipantsFromDB(giveawayMessage.id);

    const embed = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${prize}\n**Winner(s):** No eligible participants.`)
      .setColor(0xFFA500);

    if (participantsArray.length === 0) {
      await giveawayMessage.edit({ embeds: [embed] });
      await deleteGiveaway(giveawayMessage.id);
      return
    }

    const winnersCount = details.winnerCount;
    const winners = [];
    const win = [];

    //dm embed
    const e = new EmbedBuilder()
      .setTitle('Congratulations!')
      .setDescription(`You have won the giveaway for **${details.prize}!**\nThis needs your immediate attention as **a rerolled prize will never come back!** | [Giveaway Link](https://discord.com/channels/${details.guildId}/${details.channelId}/${giveawayMessage.id})`)
      .setColor(0xFFC0CB)
      

    // Winner selection
    for (let i = 0; i < winnersCount; i++) {
      if (participantsArray.length === 0) {
        break; // No more participants to select as winners
      }
      const randomIndex = Math.floor(Math.random() * participantsArray.length);
      const winner = participantsArray.splice(randomIndex, 1)[0];
      winners.push(`<@${winner}>`);
      win.push(`${winner}`)
    }
    
    const embedWin = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${prize}\n**Winner(s):** ${winners.join(', ')}`)
      .setColor(0xFFA500);

    if (winners.length > 0) {
      await removeWinnersFromDB(giveawayMessage.id, win);
      await giveawayMessage.edit({ embeds: [embedWin] });
      await giveawayMessage.reply(`**Congratulations to ${winners.join(', ')} for winning!**`);
      win.forEach((u) => {
        const user = message.guild.members.cache.get(u);
        user.send({ embeds: [e] })
      });
    } else {
      await giveawayMessage.edit({ embeds: [embed] });
    }

    await deleteGiveaway(giveawayMessage.id);
    return 
  } catch (error) {
    console.error("Error handling giveaway", error);
    return message.channel.send('An error occurred while handling the giveaway.');
  }
});
    
//timeout to end giveaway
  setTimeout(() => {
    collector.stop();
    }, parseDuration(duration));
}


//giveaway force stop
async function stopGiveaway(giveawayId, message) {
  try {
    const details = await getGiveawayDetails(giveawayId);

    if (!details) {
      return message.channel.send('Giveaway already ended / not found!');
    }

    const guild = message.guild;
    const giveawayChannel = guild.channels.cache.get(details.channelId);
    const giveawayMessage = await giveawayChannel.messages.fetch(giveawayId);
    
    if (!giveawayMessage) {
      return message.channel.send('Giveaway Message not found!')
    }

    const participantsArray = await fetchParticipantsFromDB(giveawayId);

    const embed = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${details.prize}\n**Winner(s):** No eligible participants.`)
      .setColor(0xFFA500);

    if (participantsArray.length === 0) {
      await giveawayMessage.edit({ embeds: [embed] });
      await deleteGiveaway(giveawayId);
      return message.channel.send('Giveaway manually ended.');
    }

    const winnersCount = details.winnerCount;
    const winners = [];
    const win = [];

    //dm embed
    const e = new EmbedBuilder()
      .setTitle('Congratulations!')
      .setDescription(`You have won the giveaway for **${details.prize}!**\nThis needs your immediate attention as **a rerolled prize will never come back!** | [Giveaway Link](https://discord.com/channels/${details.guildId}/${details.channelId}/${giveawayId})`)
      .setColor(0xFFC0CB)

    // Winner selection
    for (let i = 0; i < winnersCount; i++) {
      if (participantsArray.length === 0) {
        break;
      }
      const randomIndex = Math.floor(Math.random() * participantsArray.length);
      const winner = participantsArray.splice(randomIndex, 1)[0];
      winners.push(`<@${winner}>`);
      win.push(`${winner}`)
    }

    const embedWin = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${details.prize}\n**Winner(s):** ${winners.join(', ')}`)
      .setColor(0xFFA500);

    if (winners.length > 0) {
      await removeWinnersFromDB(giveawayMessage.id, win);
      await giveawayMessage.edit({ embeds: [embedWin] });
      await giveawayMessage.reply(`**Congratulations to ${winners.join(', ')} for winning!**`);
      win.forEach((u) => {
        const user = guild.members.cache.get(u);
        user.send({ embeds: [e] })
      });
    } else {
      await giveawayMessage.edit({ embeds: [embed] });
    }

    await deleteGiveaway(giveawayId);
    return message.channel.send('Giveaway manually ended.');
  } catch (error) {
    console.error("Error handling giveaway", error);
    return message.channel.send('An error occurred while handling the giveaway.');
  }
}

//giveaway reroll
async function rerollGiveaway(giveawayId, winnersCount, message) {
  try {
    const details = await getAllGiveawaysInfo(giveawayId);

    if (!details) {
      return message.channel.send('Giveaway not found!');
    }

    const guild = message.guild;
    const giveawayChannel = guild.channels.cache.get(details.channelId);
    const giveawayMessage = await giveawayChannel.messages.fetch(giveawayId);
    
    if (Date.now() < details.endTime) {
      return message.channel.send('Giveaway not ended!')
    }
    
    if (!giveawayMessage) {
      return message.channel.send('Giveaway Message not found!')
    }
    
    if (winnersCount > details.winnerCount) {
      return message.channel
     .send('You cannot reroll a giveaway to have more winners than specified in the original!')
    }

    const participantsArray = await fetchParticipantsAll(giveawayId);

    const embed = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${details.prize}\n**Winner(s):** No eligible participants.`)
      .setColor(0xFFA500);

    if (participantsArray.length === 0) {
      return message.channel.send('No more participants to reroll.');
    }

    const winners = [];
    const win = [];

    //dm embed
    const e = new EmbedBuilder()
      .setTitle('Congratulations!')
      .setDescription(`You have won the giveaway for **${details.prize}!**\nThis needs your immediate attention as **a rerolled prize will never come back!** | [Giveaway Link](https://discord.com/channels/${details.guildId}/${details.channelId}/${giveawayId})`)
      .setColor(0xFFC0CB)
      

    // Winner selection
    for (let i = 0; i < winnersCount; i++) {
      if (participantsArray.length === 0) {
        break;
      }
      const randomIndex = Math.floor(Math.random() * participantsArray.length);
      const winner = participantsArray.splice(randomIndex, 1)[0];
      winners.push(`<@${winner}>`);
      win.push(`${winner}`)
    }

    const embedWin = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${details.prize}\n**Winner(s):** ${winners.join(', ')}`)
      .setColor(0xFFA500);

    if (winners.length > 0) {
      await removeWinnersFromDB(giveawayMessage.id, win);
      await giveawayMessage.edit({ embeds: [embedWin] });
      await giveawayMessage.reply(`**Congratulations to ${winners.join(', ')} for winning!**`);
      win.forEach((u) => {
        const user = guild.members.cache.get(u);
        user.send({ embeds: [e] })
      });
    } else {
      await giveawayMessage.edit({ embeds: [embed] });
    }

    return message.channel.send('Giveaway rerolled.');
  } catch (error) {
    console.error("Error handling giveaway", error);
    return message.channel.send('An error occurred while handling the giveaway.');
  }
}

//giveaway list embed
async function createGiveawayEmbed(giveaways, title) {   
    const w = [];
    let i = 0;
    for (const giveaway of giveaways) {
      i +=1;
      const endTime = new Date(giveaway.endTime);
      w.push(`\n\n${i} | ${giveaway.id} | ${giveaway.prize} | <t:${Math.floor(endTime/1000)}:f>`)
       }
    const em = new EmbedBuilder()
      .setTitle(title)
      .setColor(0x800080)
      .setDescription(`** S No. |        ID        |      Prize      |     End Time   |**${w}`)
   return em;
}

//giveaway list function
async function giveawaysList(message) {
  const guildId = message.guild.id;

  const currentTime = Date.now();
  const activeGiveaways = await getActiveGiveaways(guildId);

  const endedGiveaways = await getEndedGiveaways(guildId, currentTime);
  if (activeGiveaways.length > 0) {
      const em = await createGiveawayEmbed(activeGiveaways, 'Active Giveaways');
      message.channel.send({ embeds: [em] });
  } else {
      message.channel.send('No active giveaways!');
  }
  if (endedGiveaways.length > 0) {
      const emb = await createGiveawayEmbed(endedGiveaways, 'Ended Giveaways');
      message.channel.send({ embeds: [emb] });
   } else {
      message.channel.send('No ended giveaways');
   }
}
 
// function to cancel an ongoing giveaway
async function cancelGiveaway(giveawayId, reason, message) {
  const details = await getGiveawayDetails(giveawayId);
  if (!details) {
    return message.channel.send('Giveaway already ended / not found')
     }
  const guild = message.guild;
  const giveawayChannel = guild.channels.cache.get(details.channelId);
  const giveawayMessage = await giveawayChannel.messages.fetch(giveawayId);
   
  if (!giveawayMessage) {
    return message.channel.send('Giveaway message not found!')
      }
  const embed = new EmbedBuilder()
     .setTitle('Giveaway Cancelled!')
     .setDescription(`This giveaway has unfortunately been called off.\n\n**Reason:** ${reason}`)
     .setColor(0x610C04)
   
  await deletePermanentDB(giveawayId);
  await deleteGiveaway(giveawayId);
   
  giveawayMessage.edit({ embeds: [embed] });
  message.channel.send('Giveaway cancelled!');
}

module.exports = {
  startGiveaway,
  stopGiveaway,
  rerollGiveaway,
  giveawaysList,
  cancelGiveaway,
};