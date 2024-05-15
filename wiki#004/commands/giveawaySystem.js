// Importing required functions and modules 
const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ChannelType 
	} = require('discord.js');
const { 
    startGiveaway,
    stopGiveaway,
    rerollGiveaway,
    cancelGiveaway,
    infoGiveaway,
    listGiveaways
	} = require(`${process.cwd()}/functions/giveawayManager.js`);

/* 
  The require() path of giveaway functions may vary depending on your structure and where you stored them.
*/

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Giveaway System')
    .addSubcommand(subcommand => 
                  subcommand.setName('start')
                  .setDescription('Start a giveaway!')
                  .addStringOption(option => 
                                  option.setName('prize')
                                  .setDescription('Prize of the giveaway.')
                                  .setRequired(true))
                  .addStringOption(option => 
                                  option.setName('duration')
                                  .setDescription('Duration of the giveaway like 1m/1h/1d.')
                                  .setRequired(true))
                  .addIntegerOption(option => 
                                   option.setName('winners')
                                   .setDescription('No. of winners of giveaway.')
                                   .setMinValue(1)
                                   .setRequired(true))
                  .addStringOption(option => 
                                  option.setName('host')
                                  .setDescription('Host of the giveaway.')
                                  .setRequired(true))
                  .addChannelOption(option => 
                                   option.setName('channel')
                                   .setDescription('Channel of the giveaway.')
                                   .addChannelTypes(ChannelType.GuildText)))	
    			  .addSubcommand(subcommand => 
                  				 subcommand.setName('stop')
                  .setDescription('Stop a giveaway!')
                  .addStringOption(option => 
                                  option.setName('giveaway_id')
                                  .setDescription('Giveaway message ID.')
                                  .setRequired(true))
                  .addChannelOption(option => 
                                   option.setName('channel')
                                   .setDescription('Channel of the giveaway to stop.')
                                   .addChannelTypes(ChannelType.GuildText)
                                   .setRequired(true)))
    			  .addSubcommand(subcommand => 
                  				 subcommand.setName('reroll')
                  .setDescription('Reroll a giveaway!')
                  .addStringOption(option => 
                                  option.setName('giveaway_id')
                                  .setDescription('Giveaway message ID.')
                                  .setRequired(true))
                  .addChannelOption(option => 
                                   option.setName('channel')
                                   .setDescription('Channel of the giveaway to stop.')
                                   .addChannelTypes(ChannelType.GuildText)
                                   .setRequired(true))
                  .addIntegerOption(option => 
                                   option.setName('count')
                                   .setDescription('No. of winners to reroll.')
                                   .setMinValue(1)
                                   .setRequired(true)))
        		  .addSubcommand(subcommand => 
                  				 subcommand.setName('cancel')
                  .setDescription('Cancel a giveaway!')
                  .addStringOption(option => 
                                  option.setName('giveaway_id')
                                  .setDescription('Giveaway message ID.')
                                  .setRequired(true))
                  .addChannelOption(option => 
                                   option.setName('channel')
                                   .setDescription('Channel of the giveaway to stop.')
                                   .addChannelTypes(ChannelType.GuildText)
                                   .setRequired(true)))
    			  .addSubcommand(subcommand => 
                                subcommand.setName('info')
                                .setDescription('Get giveaway info!')
                                .addStringOption(option => 
                                                 option.setName('giveaway_id')
                                                .setDescription('Giveaway message ID.')
                                                .setRequired(true)))
    			  .addSubcommand(subcommand => 
                                subcommand.setName('list')
                                .setDescription('Get giveaway list!')
                                .addStringOption(option => 
                                                 option.setName('type')
                                                .setDescription('Type of giveaway to List.')
                                                .setRequired(true)
                                                .addChoices(
                      			{ name: 'Active Giveaways', value: 'active' },
                      			{ name: 'Ended Giveaways', value: 'ended' },
                                { name: 'Stopped Giveaways', value: 'stopped' },
                                { name: 'Cancelled Giveaways', value: 'cancelled' },
                  				))),

  async execute(interaction) {

      if (interaction.options.getSubcommand() === 'start') {
    // GIVEAWAY_START
          const prize = interaction.options.getString('prize');
          const duration = interaction.options.getString('duration');
          const winners = interaction.options.getInteger('winners');
          const host = interaction.options.getString('host');   
          const channelId = interaction.options.getChannel('channel')?.id ?? interaction.channel.id;
          await interaction.deferReply({ ephemeral: true });
          await startGiveaway(prize, duration, interaction, winners, host, channelId);
          await interaction.followUp('Giveaway Created!');
      } else if (interaction.options.getSubcommand() === 'stop') {
    // GIVEAWAY_STOP
          const giveawayId = interaction.options.getString('giveaway_id');
          const channelId = interaction.options.getChannel('channel')?.id;
          await interaction.deferReply({ ephemeral: true });
          const a = await stopGiveaway(interaction?.client, interaction?.guild?.id, giveawayId, channelId, "stopped");
          await interaction.followUp(`${a ? "Ended" : "Invalid message(giveaway) ID / message not found / already ended!"}`);
      } else if (interaction.options.getSubcommand() === 'reroll') {
    // GIVEAWAY_REROLL
          const giveawayId = interaction.options.getString('giveaway_id');
          const channelId = interaction.options.getChannel('channel')?.id;
          const count = interaction.options.getInteger('count');
          await interaction.deferReply({ ephemeral: true });
          const r = await rerollGiveaway(interaction, giveawayId, channelId, count);
          await interaction.followUp(`${r ? "Rerolled" : "Invalid message(giveaway) ID / message not found / un-rerollable!"}`);
      } else if (interaction.options.getSubcommand() === 'cancel') {
    // GIVEAWAY_CANCEL
          const giveawayId = interaction.options.getString('giveaway_id');
          const channelId = interaction.options.getChannel('channel')?.id;
          await interaction.deferReply({ ephemeral: true });
          const c = await cancelGiveaway(interaction, channelId, giveawayId);
          await interaction.followUp(`${c ? "Cancelled" : "Invalid message(giveaway) ID / message not found / already ended!"}`);
      } else if (interaction.options.getSubcommand() === 'info') {
    // GIVEAWAY_INFO
          const giveawayId = interaction.options.getString('giveaway_id');
          await interaction.deferReply({ ephemeral: true });
          await infoGiveaway(interaction, giveawayId);
      } else if (interaction.options.getSubcommand() === 'list') {
    // GIVEAWAY_LIST
          const type = interaction.options.getString('type');
          await interaction.deferReply({ ephemeral: true });
          await listGiveaways(interaction, type);
      }
  }
}