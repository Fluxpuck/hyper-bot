/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'logId was not provided', 4800);









}

//command information
module.exports.info = {
    name: 'removelog',
    alias: ['remove_log'],
    category: 'management',
    desc: 'Remove a member log',
    usage: '{prefix}removelog logId',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'text',
        type: 'STRING',
        description: 'What should the bot say?',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}