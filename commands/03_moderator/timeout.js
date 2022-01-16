/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getUserFromInput } = require("../../utils/Resolver");
const { createHyperLog } = require("../../utils/AuditManager");
const { getModuleSettings } = require("../../utils/PermissionManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);

    //get target user
    const target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) return ReplyErrorMessage(message, '@user was not found', 4800);

    //check if target is moderator
    if (target.permissions.has('KICK_MEMBERS')) return ReplyErrorMessage(message, '@user is a moderator', 4800);
    //check if target is already timed out
    const timedifference = target.communicationDisabledUntilTimestamp - Date.now();
    if (timedifference > 0) return ReplyErrorMessage(message, '@user is already timed out', 4800);



    //fix timeout


    //GET TIMER...
    let time_input = arguments[1];


    //GET REASON...

    //CALCULATE TIME TO MINUTES




    //check and set reason, else use default message
    let r = arguments.slice(2) //slice reason from arguments
    let reason = (r.length > 0) ? '' : 'No reason was provided.' //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    //timeout the target
    const mute = await target.timeout(10 * 60 * 1000, `{HYPER} ${reason}`).catch(err => {
        ReplyErrorMessage(message, `An Error occured, and ${target.user.tag} was not muted`);
        return false
    });

    //check if action was succesfull
    if (mute != false) {
        //verify that the user has been timed out
        message.reply(`**${target.user.tag}** has been timed out for ${null} minutes.`);
        //save log to database and log event
        await createHyperLog(message, 'timeout', 10 * 60 * 1000, target, reason);
        //get module settings, proceed if true
        const moderationAction = await getModuleSettings(message.guild, 'moderationAction');
        if (moderationAction.state === 1 && moderationAction.channel != null) {
            //don't log in channels that are excepted from logging
            if (moderationAction.exceptions.includes(message.channel.id)) return;
            return SendModerationActionMessage(message, module.exports.info.name, moderationAction.channel)
        }
    }
    return;
}


//command information
module.exports.info = {
    name: 'timeout',
    alias: ['mute'],
    category: 'moderation',
    desc: 'Mute target member for X minutes in the server',
    usage: '{prefix}timeout @user [time] [reason]',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'user',
        type: 'USER',
        description: 'Mention target user',
        required: true,
    },
    {
        name: 'time',
        type: 'NUMBER',
        description: 'Duration in minutes',
        required: true,
    },
    {
        name: 'reason',
        type: 'STRING',
        description: 'Reason why member is muted',
        required: false,
    }]
}