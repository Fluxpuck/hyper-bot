/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {












}


//command information
module.exports.info = {
    name: 'user-stats',
    alias: [''],
    category: 'stats',
    desc: 'Check the activity stats of a specific user',
    usage: '{prefix}user-stats roleId',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}