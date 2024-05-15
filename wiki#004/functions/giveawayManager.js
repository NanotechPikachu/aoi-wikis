// Importing required functions and modules
const { parseDuration } = require('./parseDuration.js');
const { 
    addGiveaway, 
    addParticipant,
    getParticipants,
    removeParticipant,
    getActiveGiveaways,
    endGiveaway,
    getGiveaway,
    fetchGiveaways
      } = require('./giveawayDB.js');
const {
    ComponentType, 
    EmbedBuilder, 
    ActionRowBuilder,
    ButtonBuilder, 
    ButtonStyle 
      } = require('discord.js');

/*
  FUNCTION: startGiveaway()
  USE: To start a giveaway and send it's embed.
  PARAMS:
    'prize': | Type: 'String' |
    'duration': | Type: 'String' |
    'interaction': | Type: 'Object' | 
    'winnersCount': | Type: 'Number' |
    'host': | Type: 'String' |
    'channelId': | Type: 'String' |
*/

async function startGiveaway(prize, duration, interaction, winnersCount, host, channelId) {
  const em = new EmbedBuilder()
        .setTitle('Giveaway!')
        .setDescription(`**Giveaway Prize:** ${prize}\n**Winner(s):** ${winnersCount}\n**Host:** ${host}\n**Ends on:** <t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:f> (<t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:R>)\n\nClick to join!`)
        .setColor(0xFFA500);
  try {
  const channel = await interaction.guild.channels.cache.get(channelId);
  const row = new ActionRowBuilder()
  	.addComponents(
    	new ButtonBuilder()
        	.setLabel('🎉 0')
        	.setCustomId('join-gw')
        	.setStyle(ButtonStyle.Primary)
    );
  const giveawayMessage = await channel.send({ embeds: [em], components: [row] });
    
  const collector = giveawayMessage.createMessageComponentCollector({
      componentType: ComponentType.Button
  });
    
  collector.on("collect", async (i) => {
      await i.deferReply({ ephemeral: true });
      const p = await participant(i);
      await i.followUp(`You have ${p ? "entered" : "exited"} the giveaway!`);
    });  

  const endTime = Date.now() + parseDuration(duration);
  const guildId = interaction.guild.id;
  const hoster = host;

  await addGiveaway(giveawayMessage.id, guildId, channel.id, prize, endTime, winnersCount, hoster);
  } catch (err) {
      return console.error(`Error in func startGiveaway: ${err}`);
  };
};

/*
  FUNCTION: participant()
  USE: To add or remove participant of a giveaway.
  PARAMS:
    'interaction': | Type: 'Object' |
*/

async function participant(interaction) {
    try {
      const parts = await getParticipants(interaction.message.id);
      let m;
      if (!parts || !parts?.includes(interaction.user.id)) {
      await addParticipant(interaction.message.id, interaction.user.id);
      const p = await getParticipants(interaction.message.id);      
      const a = new ActionRowBuilder()
      .addComponents(
      new ButtonBuilder()
        .setLabel(`🎉 ${p?.length}`)
        .setCustomId('join-gw')
        .setStyle(ButtonStyle.Primary)
      );
      m = await interaction.channel.messages.fetch(interaction.message.id);
      await m.edit({ components: [a] });
      return true;
    } else {   
      await removeParticipant(interaction.message.id, interaction.user.id);
      const p = await getParticipants(interaction.message.id);
      const a = new ActionRowBuilder()
      .addComponents(
      new ButtonBuilder()
        .setLabel(`🎉 ${p?.length}`)
        .setCustomId('join-gw')
        .setStyle(ButtonStyle.Primary)
      );
      
      m = await interaction.channel.messages.fetch(interaction.message.id);
      await m.edit({ components: [a] });
    
     return false;
    };
   } catch (err) {
      return console.error(`Error in func participants: ${err}`);
  };
};

/*
  FUNCTION: stopGiveaway()
  USE: To stop a giveaway and edit the embed with winners.
  PARAMS:
    'client': | Type: 'Object' |
    'guildId': | Type: 'String' |
    'giveawayId': | Type: 'String' |
    'channelId': | Type: 'String' |
    'status': | Type: 'String' | Choices: ['ended', 'stopped', 'active(not applicable here)', 'cancelled(not applicable here)'] |
*/

};

async function stopGiveaway(client, guildId, giveawayId, channelId, status) {
    try {
    const dat = await endGiveaway(giveawayId, channelId, status);
    if (!dat) return false;
    const guild = await client.guilds.cache.get(guildId); 
    const n = await guild.channels.cache.get(channelId);
    if (!n) return false;
    const p = await getParticipants(giveawayId);
    const gw = await getGiveaway(giveawayId);
    const m = await n.messages.fetch(giveawayId);
    if (!gw || !m) return false;
    if (gw && m) {
      const j = chooseWinner(gw?.winnerCount, p);
    
      const a = new ActionRowBuilder()
     	 .addComponents(
   	 	  new ButtonBuilder()
     	   .setLabel(`🎉 ${p?.length + (j?.length || 0) || 0}`)
      	   .setCustomId('join-gw')
      	   .setDisabled(true)
       	   .setStyle(ButtonStyle.Primary)
        );
      let em; 
      if (j?.length > 0) {
        j.forEach((x) => {
        const user = guild.members.cache.get(x?.replace("<@", '')?.replace('>', '')?.trim());
        const emb = new EmbedBuilder()
        		.setTitle("Congratulations!")
        		.setDescription(`You have won a giveaway!\n\n**Prize:** ${gw?.prize}\n**Guild:** ${guild?.name}`)
        		.setColor(0xFFFF00)
        		.setTimestamp();
        const act = new ActionRowBuilder()
        		.addComponents(
                	new ButtonBuilder()
                    	.setLabel('Giveaway Link')
                    	.setURL(`https://discord.com/channels/${guildId}/${channelId}/${giveawayId}`)
                     .setStyle(ButtonStyle.Link)
                );
        if (user) user.send({ embeds: [emb], components: [act] }).catch((er) => console.error(er));
 removeParticipant(giveawayId, x?.replace('<@', '')?.replace('>', '')?.trim())
        });
       m.reply(`Congratulations to winner(s) ${j?.join(", ")}`).catch((err) => console.error(err));
       em = new EmbedBuilder()
          .setTitle(`Giveaway Ended!`)
          .setDescription(`**Giveaway Prize:** ${gw?.prize}\n**Winner(s):** ${j?.join(', ')}`)
          .setColor(0xFFA500);
    } else {
        em = new EmbedBuilder()
          .setTitle('Giveaway Ended!')
          .setDescription(`**Giveaway Prize:** ${gw?.prize}\n**Winner(s):** No eligible participants.`)
          .setColor(0xFFA500);
    };
    m.edit({ embeds: [em], components: [a] }).catch((err) => console.error(err));
    };
    return true;
    } catch (err) {
        return console.error(`Error in func stopGiveaway: ${err}`);
    };
};

/*
  FUNCTION: cancelGiveaway()
  USE: To cancel a giveaway and doesn't return winners.
  PARAMS:
    'interaction': | Type: 'Object' |
    'channelId': | Type: 'String' |
    'giveawayId': | Type: 'String' |
*/

async function cancelGiveaway(interaction, channelId, giveawayId) {
    const status = "cancelled";
    try {
    const channel = interaction.guild.channels.cache.get(channelId);
    if (!channel) return false;
    const gw = await getGiveaway(giveawayId);
    const m = await channel.messages.fetch(giveawayId);
    const p = await getParticipants(giveawayId);
    if (!gw || !m) return false;
    if (gw?.status !== "active") return false;
    const dat = await endGiveaway(giveawayId, channelId, status);
    if (!dat) return false;
    const a = new ActionRowBuilder()
     	 .addComponents(
   	 	  new ButtonBuilder()
     	   .setLabel(`🎉 ${p?.length || 0}`)
      	   .setCustomId('join-gw')
      	   .setDisabled(true)
       	   .setStyle(ButtonStyle.Primary)
        );
    const em = new EmbedBuilder()
    	.setTitle('Giveaway Cancelled!')
    	.setDescription(`**Giveaway Prize:** ${gw?.prize}\n**Winner(s):** None (due to cancellation).`)
    	.setColor(0xFFA500);
    m.edit({ embeds: [em], components: [a] });
    return true;
    } catch (err) {
        return console.error(`Error in func cancelGiveaway: ${err}`);
    };
};

/*
  FUNCTION: rerollGiveaway()
  USE: To reroll an already ended giveaway.
  PARAMS:
    'interaction': | Type: 'Object' |
    'giveawayId': | Type: 'String' |
    'channelId': | Type: 'String' |
    'count': | Type: 'Number' |
*/

async function rerollGiveaway(interaction, giveawayId, channelId, count) {
    try {
    const n = await interaction.guild.channels.cache.get(channelId);
    if (!n) return false;
    const p = await getParticipants(giveawayId);
    const gw = await getGiveaway(giveawayId);
    const m = await n.messages.fetch(giveawayId);
   
    if (!gw || !m || gw?.status === "active") return false;
    if (gw && m) {
      const j = chooseWinner(count, p);
      const a = new ActionRowBuilder()
     	 .addComponents(
   	 	  new ButtonBuilder()
     	   .setLabel(`🎉 ${p?.length + (j?.length || 0) || 0}`)
      	   .setCustomId('join-gw')
      	   .setDisabled(true)
       	  .setStyle(ButtonStyle.Primary)
        );
      let em; 
      if (j?.length > 0) {
        j.forEach((x) => {
            removeParticipant(giveawayId, x?.replace('<@', '')?.replace('>', '')?.trim());
        });
       m.reply(`Congratulations to winner(s) ${j?.join(", ")}`).catch((err) => console.error(err));
       em = new EmbedBuilder()
          .setTitle(`Giveaway Ended!`)
          .setDescription(`**Giveaway Prize:** ${gw?.prize}\n**Winner(s):** ${j?.join(', ')}`)
          .setColor(0xFFA500);
    } else {
        em = new EmbedBuilder()
          .setTitle('Giveaway Ended!')
          .setDescription(`**Giveaway Prize:** ${gw?.prize}\n**Winner(s):** No eligible participants.`)
          .setColor(0xFFA500);
    };
    m.edit({ embeds: [em], components: [a] }).catch((err) => console.error(err));
    };
    return true;
    } catch (err) {
        return console.error(`Error in func rerollGiveaway: ${err}`);
    };
};

/*
  FUNCTION: listGiveaways()
  USE: To return a list of giveaway depending on status in embed.
  PARAMS:
    'interaction': | Type: 'Object' |
    'status': | Type: 'String' | Choices: ['ended', 'stopped', 'active', 'cancelled'] |
*/

async function listGiveaways(interaction, status) {
    try {
    const g = await fetchGiveaways(interaction.guild.id, status);
    let l = [];
    let i = 1;
    if (g?.length > 0) {
      for (const o of g) {
         if (i > 25) break;
         l.push(`${i} | **ID: **${o?.giveawayId} | **Prize:**${o?.prize}`);
         i++;
      };
    };
    
    const em = new EmbedBuilder()
      .setTitle(`Giveaways List - ${status}`)
      .setDescription(`${l?.length > 0 ? l?.join("\n") : "N/A"}`)
      .setColor(0xFFA500);
    interaction.followUp({ embeds: [em] });
    } catch (err) {
        return console.error(`Error in func listGiveaways: ${err}`);
    };
};

/*
  FUNCTION: infoGiveaway()
  USE: To get info of a giveaway in embed.
  PARAMS:
    'interaction': | Type: 'Object' |
    'giveawayId': | Type: 'String' |
*/

async function infoGiveaway(interaction, giveawayId) {
    try {
    const a = await getGiveaway(giveawayId);
    if (!a) return await interaction.followUp("Invalid giveaway message ID");
    const em = new EmbedBuilder()
      .setTitle('Giveaway Info')
      .setDescription(`**Giveaway ID**: ${a?.giveawayId}\n**Prize:** ${a?.prize}\n**Host:** ${a?.hoster}\n**End Time:** <t:${Math.floor((a?.endTime)/1000)}:f>\n**Status:** ${a?.status}`)
      .setColor(0xFFA500)
    return await interaction.followUp({ embeds: [em] });
    } catch (err) {
        return console.error(`Error in func infoGiveaway: ${err}`);
    };
};

/*
  FUNCTION: chooseWinner()
  USE: To choose a random winner(depending on count passed) from the giveaway participants DB.
  PARAMS:
    'count': | Type: 'Number' |
    'w': | Type: 'Array' |
*/

function chooseWinner(count, w) {
  // the 'w' param has the Array of participants.
    const winners = [];
    for (let i = 0; i < count; i++) {
      if (w?.length === 0 || !w) {
        break;
      };
      const randomIndex = Math.floor(Math.random() * w?.length);
      const winner = w?.splice(randomIndex, 1)[0];
      winners.push(`<@${winner}>`);
    };
    return winners;
};

module.exports = {
    startGiveaway,
    participant,
    stopGiveaway,
    cancelGiveaway,
    rerollGiveaway,
    listGiveaways,
    infoGiveaway
};