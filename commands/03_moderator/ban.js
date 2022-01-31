/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { getModuleSettings } = require("../../utils/PermissionManager");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getUserFromInput } = require("../../utils/Resolver");
const { createHyperLog } = require("../../utils/AuditManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //setup and change some values for interaction
    const oldMessage = message; //save for original author, execution logging
    const interaction = (message.interaction) ? message.interaction : undefined;
    if (interaction) message = await interaction.fetchReply();

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);

    //get target user
    const target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) return ReplyErrorMessage(message, '@user was not found', 4800);

    //check if target is moderator
    if (target.permissions.has('BAN_MEMBERS')) return ReplyErrorMessage(message, '@user is a moderator', 4800);

    //check and set reason, else use default message
    let r = arguments.slice(1) //slice reason from arguments
    let reason = (r.length > 0) ? '' : 'No reason was provided.' //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    //ban the target
    const ban = await target.ban({ reason: `{HYPER} ${reason}` }).catch(err => {
        ReplyErrorMessage(message, `An Error occured, and ${target.user.tag} was not banned`);
        return false
    });

    //check if action was succesfull
    if (ban != false) {
        //verify that the user has been kicked
        if (interaction) interaction.editReply({ content: `**${target.user.tag}** has been banned from the server`, ephemeral: true });
        else message.reply(`**${target.user.tag}** has been banned from the server`);
        //save log to database and log event
        await createHyperLog(message, 'ban', null, target, reason);
        //get module settings, proceed if true
        const moderationAction = await getModuleSettings(message.guild, 'moderationAction');
        if (moderationAction.state === 1 && moderationAction.channel != null) {
            //don't log in channels that are excepted from logging
            if (moderationAction.exceptions.includes(message.channel.id)) return;
            return SendModerationActionMessage(oldMessage, module.exports.info.name, moderationAction.channel)
        }
    }
    return;
}


//command information
module.exports.info = {
    name: 'ban',
    alias: [],
    category: 'moderation',
    desc: 'Ban target member from the server',
    usage: '{prefix}ban @user [reason] ',
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
        description: 'Reason for ban',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}