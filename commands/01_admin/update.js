/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const PermissionManager = require('../../utils/PermissionManager');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {


    //get and cache guild prefix, command permissions and module settings
    await PermissionManager.loadGuildPrefixes(client); //cache guild prefixes
    await PermissionManager.loadGuildConfiguration(client); //set guild roles
    await PermissionManager.loadCommandPermissions(client); //cache command permissions
    await PermissionManager.loadModuleSettings(client); //cache module settings


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
    options: []
}