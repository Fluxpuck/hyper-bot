/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const PermissionManager = require('../../utils/PermissionManager');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //update call guild specific cache values
    await PermissionManager.loadGuildPrefixes(message.guild); //cache guild prefixes
    await PermissionManager.loadGuildConfiguration(message.guild); //set guild config
    await PermissionManager.loadCommandPermissions(message.guild); //cache command permissions
    await PermissionManager.loadCustomCommands(message.guild); //cache custom commands
    await PermissionManager.loadModuleSettings(message.guild); //cache module settings

    //return message
    return message.reply(`All **permissions** have been fetched and the caches have been updated.`)

}


//command information
module.exports.info = {
    name: 'update',
    alias: ['cache'],
    category: 'admin',
    desc: 'Update caches',
    usage: '{prefix}update',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}