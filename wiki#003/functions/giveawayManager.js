const { parseDuration } = require('/parseDuration.js');
const { addGiveaway, addUserToGiveawayDB, fetchParticipantsFromDB, deleteGiveaway, getGiveawayDetails } = require('/giveawayDB.js');
const { EmbedBuilder } = require('discord.js');

//Start the giveaway 
async function startGiveaway(prize, duration, message, winnersCount) {
  const em = new EmbedBuilder()
        .setTitle('Giveaway!')
        .setDescription(`**Giveaway Prize:** ${prize}\n**Winner(s):** ${winnersCount}\n**Ends on:** <t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:f> (<t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:R>)\n\nReact 🎉 to join!`)
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

    // Winner selection
    for (let i = 0; i < winnersCount; i++) {
      if (participantsArray.length === 0) {
        break; // No more participants to select as winners
      }
      const randomIndex = Math.floor(Math.random() * participantsArray.length);
      const winner = participantsArray.splice(randomIndex, 1)[0];
      winners.push(`<@${winner}>`);
    }

    const embedWin = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${prize}\n**Winner(s):** ${winners.join(', ')}`)
      .setColor(0xFFA500);

    if (winners.length > 0) {
      await giveawayMessage.edit({ embeds: [embedWin] });
      await giveawayMessage.reply(`**Congratulations to ${winners.join(', ')} for winning!**`);
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
      return message.channel.send('Giveaway not found!');
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

    // Winner selection
    for (let i = 0; i < winnersCount; i++) {
      if (participantsArray.length === 0) {
        break;
      }
      const randomIndex = Math.floor(Math.random() * participantsArray.length);
      const winner = participantsArray.splice(randomIndex, 1)[0];
      winners.push(`<@${winner}>`);
    }

    const embedWin = new EmbedBuilder()
      .setTitle('Giveaway Ended!')
      .setDescription(`**Giveaway Prize:** ${details.prize}\n**Winner(s):** ${winners.join(', ')}`)
      .setColor(0xFFA500);

    if (winners.length > 0) {
      await giveawayMessage.edit({ embeds: [embedWin] });
      await giveawayMessage.reply(`**Congratulations to ${winners.join(', ')} for winning!**`);
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


module.exports = {
  startGiveaway,
  stopGiveaway,
};
