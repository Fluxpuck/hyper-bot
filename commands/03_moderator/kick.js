/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { createHyperLog } = require("../../utils/AuditManager");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getModuleSettings } = require("../../utils/PermissionManager");
const { getUserFromInput } = require("../../utils/Resolver");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    const oldMessage = message; //save for original author, execution logging
    const interaction = (message.interaction) ? message.interaction : undefined;
    if (interaction) message = await interaction.fetchReply();

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(oldMessage, '@user was not provided', 4800);

    //get target user
    const target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) return ReplyErrorMessage(oldMessage, '@user was not found', 4800);

    //check if target is moderator
    if (target.permissions.has('KICK_MEMBERS')) return ReplyErrorMessage(oldMessage, '@user is a moderator', 4800);

    //check and set reason, else use default message
    let r = arguments.slice(1) //slice reason from arguments
    let reason = (r.length > 0) ? '' : 'No reason was provided.' //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    // kick the target
    const kick = await target.kick({ reason: `{HYPER} ${reason}` }).catch(err => {
        ReplyErrorMessage(oldMessage, `An Error occured, and ${target.user.tag} was not kicked`);
        return false
    });

    //check if action was succesfull
    if (kick != false) {
        //verify that the user has been kicked
        if (interaction) interaction.editReply({ content: `**${target.user.tag}** has been kicked from the server`, ephemeral: true });
        else message.reply(`**${target.user.tag}** has been kicked from the server`);
        //save log to database and log event
        await createHyperLog(message, 'kick', null, target, reason);
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
    name: 'kick',
    alias: [],
    category: 'moderation',
    desc: 'Kick target member from the server',
    usage: '{prefix}kick @user [reason]',
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
        description: 'Reason for kick',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}