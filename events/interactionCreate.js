/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//require utilities
const { getCommandPermissions, checkCommandPermissions } = require("../utils/PermissionManager");
const { getChannelfromInput, getUserFromInput } = require("../utils/Resolver");

//require configuration
const { applicationButton } = require('../config/config.json');

module.exports = async (client, interaction) => {

    //check if interaction is application button
    if (interaction.customId == applicationButton) {
        client.emit('applicationCreate', interaction);
    }

    //check if interaction is application command
    if (!interaction.isCommand()) return;

    //filter the interaction input
    const { channelId, guildId } = interaction
    const { commandName, commandId } = interaction
    const { user, options } = interaction

    //get channel and member details
    const guild = await client.guilds.cache.get(guildId);
    const channel = await getChannelfromInput(guild, channelId);
    const member = await getUserFromInput(guild, user.id);

    //setup message for command handler
    const message = { interaction: interaction, channel: channel, guild: guild, author: member, slashinteraction: true }
    const messageArgs = options._hoistedOptions.map(m => m.value)

    //get the client command
    const commandFile = client.commands.get(commandName)
    if (commandFile) {

        //get command permissions from cache
        const permissions = await getCommandPermissions(guild, commandName);
        const verification = await checkCommandPermissions(message, commandName, permissions);

        //execute commandfile if user has permission
        if (verification.status === true) {
            if (commandFile.slash.ephemeral == true) await interaction.deferReply({ ephemeral: true }); //wait for interaction
            if (commandFile.slash.ephemeral == false) await interaction.deferReply({ ephemeral: false }); //wait for interaction
            commandFile.run(client, message, messageArgs, guild.prefix, verification); //execute command
        } else interaction.reply({ content: verification.message, ephemeral: true });

    }
    return;
}