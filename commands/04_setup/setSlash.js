/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//require modules
const { Application } = require("discord.js");
const { getSlashCommands, registerSlashCommands, updateSlashCommands, removeSlashCommands } = require("../../utils/ClientManager")

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'Please \`enable\` or \`disable\`  ', 4800);

    //get slash commands
    const slashCommands = await getSlashCommands(client.commands, message.guild);
    if (commandlist.size <= 0) return ReplyErrorMessage(message, 'An Error occured. There are no commands available for Slash Commands', 4800);

    //if argument is "enable", enable Slash Commands
    if (arguments[0] == "enable") {
        return registerSlashCommands(client, slashCommands, message.guild.id); //register slash commands
    }

    //if argument is "disable", disable Slash Commands
    if (arguments[0] == "disable") {
        return removeSlashCommands(client, message.guild); //remove slash commands
    }

    return;
}


//command information
module.exports.info = {
    name: 'slash',
    alias: [],
    category: 'setup',
    desc: 'Enable or Disable slash commands',
    usage: '{prefix}slash [enable/disable]',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}