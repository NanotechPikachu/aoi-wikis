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
    EmbedBuilder, 
    ActionRowBuilder,
    ButtonBuilder, 
    ButtonStyle 
      } = require('discord.js');

async function startGiveaway(prize, duration, interaction, winnersCount, host, channelId) {
  const em = new EmbedBuilder()
        .setTitle('Giveaway!')
        .setDescription(`**Giveaway Prize:** ${prize}\n**Winner(s):** ${winnersCount}\n**Host:** ${host}\n**Ends on:** <t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:f> (<t:${Math.floor((Date.now() + parseDuration(duration))/1000)}:R>)\n\nClick to join!`)
        .setColor(0xFFA500);
    
  const channel = await interaction.guild.channels.cache.get(channelId);
  const row = new ActionRowBuilder()
  	.addComponents(
    	new ButtonBuilder()
        	.setLabel('🎉 0')
        	.setCustomId('join-gw')
        	.setStyle(ButtonStyle.Primary)
    );
  const giveawayMessage = await channel.send({ embeds: [em], components: [row] });

  const endTime = Date.now() + parseDuration(duration);
  const guildId = interaction.guild.id;
  const hoster = host;

  await addGiveaway(giveawayMessage.id, guildId, channel.id, prize, endTime, winnersCount, hoster);
};

async function participant(interaction) {
    const parts = await getParticipants(interaction.message.id);
    if (!parts || !parts?.includes(interaction.author.id)) {

      await addParticipant(interaction.message.id, interaction.author.id);
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
       
      await removeParticipant(interaction.message.id, interaction.author.id);
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
};

async function stopGiveaway(d, guildId, giveawayId, channelId, status) {
    const dat = await endGiveaway(giveawayId, channelId, status);
    if (!dat) return false;
    const guild = await d.util.getGuild(d, guildId); 
    const n = await d.util.getChannel(d, channelId);
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
        if (user) user.send(`You have won ${gw?.prize}\nClick https://discord.com/channels/${guildId}/${channelId}/${giveawayId}`).catch((er) => console.error(er));
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
};

async function cancelGiveaway(interaction, channelId, giveawayId) {
    const status = "cancelled";
    const channel = interaction.guild.channels.cache.get(channelId);
    if (!channel) return false;
    const gw = await getGiveaway(giveawayId);
    const m = await channel.messages.fetch(giveawayId);
    const p = await getParticipants(giveawayId);
    if (!gw || !m || !p) return false;
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
};

async function rerollGiveaway(interaction, giveawayId, channelId, count) {
    const n = await interaction.channel;
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
};

async function listGiveaways(interaction, status) {
    const g = await fetchGiveaways(interaction.guild.id, status);
    let l = [];
    let i = 1;
    if (g?.length > 0) {
      for (const o of g) {
         if (i > 25) break;
         l.push(`${i} | ${o?.giveawayId} | ${o?.prize}`);
         i++;
      };
    };
    
    const em = new EmbedBuilder()
      .setTitle(`Giveaways List - ${status}`)
      .setDescription(`${l?.length > 0 ? l?.join("\n") : "N/A"}`)
      .setColor(0xFFA500);
    interaction.followUp({ embeds: [em] });
};

async function infoGiveaway(interaction, giveawayId) {
    const a = await getGiveaway(giveawayId);
    if (!a) return await interaction.followUp("Invalid giveaway message ID");
    const em = new EmbedBuilder()
      .setTitle('Giveaway Info')
      .setDescription(`**Giveaway ID**: ${a?.giveawayId}\n**Prize:** ${a?.prize}\n**Host:** ${a?.hoster}\n**End Time:** <t:${Math.floor((a?.endTime)/1000)}:f>\n**Status:** ${a?.status}`)
      .setColor(0xFFA500)
    return await interaction.followUp({ embeds: [em] });
};

function chooseWinner(count, w) {
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