/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const { ReplyErrorMessage } = require("../../utils/MessageManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'logId was not provided', 4800);

    //check and set reason, else use default message
    let r = arguments.slice(1) //slice reason from arguments
    let reason = (r.length > 0) ? '' : false //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    //if there was no new reason provided
    if (reason == false) return ReplyErrorMessage(message, 'No new reason was provided', 4800);






}

//command information
module.exports.info = {
    name: 'changelog',
    alias: ['change_log'],
    category: 'management',
    desc: 'Change a member log',
    usage: '{prefix}changelog logId',
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