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