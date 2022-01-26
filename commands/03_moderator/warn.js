/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getUserFromInput } = require("../../utils/Resolver");
const { SendWarningMessageDM } = require("../../utils/MessageManager");
const { createHyperLog } = require("../../utils/AuditManager");
const { getModuleSettings } = require("../../utils/PermissionManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);
    if (arguments.length >= 1 && arguments.length < 3) return ReplyErrorMessage(message, 'Reason was not provided or too short', 4800);

    //get target user
    const target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) return ReplyErrorMessage(message, '@user was not found', 4800);

    //check if target is moderator
    if (target.permissions.has('KICK_MEMBERS')) return ReplyErrorMessage(message, '@user is a moderator', 4800);

    //check and set reason, else use default message
    let r = arguments.slice(1) //slice reason from arguments
    let reason = (r.length > 0) ? '' : 'No reason was provided.' //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    //warn the user
    const warning = await SendWarningMessageDM(client, message, reason, target);

    //verify that the user has been warned
    if (warning.status === false) {
        message.reply(`${warning.message}, but warning has been logged`);
    } else if (warning.status === true) {
        message.reply(`${warning.message}, and it has been logged`);
    }

    //save log to database and log event
    await createHyperLog(message, 'warn', null, target, reason);
    //get module settings, proceed if true
    const moderationAction = await getModuleSettings(message.guild, 'moderationAction');
    if (moderationAction.state === 1 && moderationAction.channel != null) {
        //don't log in channels that are excepted from logging
        if (moderationAction.exceptions.includes(message.channel.id)) return;
        return SendModerationActionMessage(message, module.exports.info.name, moderationAction.channel)
    }
    return;
}


//command information
module.exports.info = {
    name: 'warn',
    alias: [],
    category: 'moderation',
    desc: 'Warn target member with a message.',
    usage: '{prefix}warn @user [message]',
}

//slash setup
module.exports.slash = {
    slash: true,
    options: [{
        name: 'user',
        type: 'USER',
        description: 'Mention target user',
        required: true,
    },
    {
        name: 'reason',
        type: 'STRING',
        description: 'Reason for warn',
        required: true,
    }],
    permission: false,
    ephemeral: true
}