/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//require modules
const { getSlashCommands, registerSlashCommands, updateSlashCommands, removeSlashCommands } = require("../../utils/ClientManager")

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //get ENABLE and DISABLE functionality with embed and two buttons!!

    //on enable, enable in guild_information table

    //on disable, disable in guild_information table





    //collect slash commands
    const slashCommands = await getSlashCommands(client.commands, message.guild);

    // await registerSlashCommands(client, slashCommands, message.guild.id); //register slash commands
    // await updateSlashCommands(client, message.guild, slashCommands); //update slash commands
    // await removeSlashCommands(client, message.guild); //remove slash commands

}


//command information
module.exports.info = {
    name: 'slash',
    alias: [],
    category: 'setup',
    desc: 'Enable or Disable slash commands',
    usage: '{prefix}test',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}