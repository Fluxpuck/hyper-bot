/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { createHyperLog } = require("../../utils/AuditManager");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getModuleSettings } = require("../../utils/PermissionManager");
const { getUserFromInput } = require("../../utils/Resolver");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);

    //get target user
    const target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) return ReplyErrorMessage(message, '@user was not found', 4800);

    //disconnect the target
    const disconnect = await target.voice.disconnect().catch(err => {
        ReplyErrorMessage(message, `An Error occured, and ${target.user.tag} was not disconnected`);
        return false
    })

    //check if action was succesfull
    if (disconnect != false) {
        //verify that the user has been kicked
        message.reply(`**${target.user.tag}** has been disconnected from the voice-channel`);
        //save log to database and log event
        await createHyperLog(message, 'disconnect', null, target, reason);
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
    name: 'disconnect',
    alias: [],
    category: 'moderation',
    desc: 'Disconnect target member from a voicechannel',
    usage: '{prefix}disconnect @user',
}

//slash setup
module.exports.slash = {
    slash: true,
    options: [{
        name: 'user',
        type: 'USER',
        description: 'Mention target user',
        required: true,
    }],
    permission: false
}