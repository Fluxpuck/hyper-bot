/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { getModuleSettings } = require("../../utils/PermissionManager");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { FetchBanLog } = require("../../utils/AuditManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);

    //get targetId from arguments
    let targetId = new RegExp('<@!([0-9]+)>', 'g').exec(arguments[0])
        || new RegExp('<@([0-9]+)>', 'g').exec(arguments[0])
        || new RegExp('([0-9]+)', 'g').exec(arguments[0])
    if (targetId == null) return ReplyErrorMessage(message, '@user was not found', 4800);

    //fetch Audit log
    const target = { id: targetId[1] }
    const BanLogs = await FetchBanLog(message.guild, target);
    if (BanLogs == false) return ReplyErrorMessage(message, '@user was not found in the list with banned members', 4800);

    //check and set reason, else use default message
    let r = arguments.slice(1) //slice reason from arguments
    let reason = (r.length > 0) ? '' : 'No reason was provided.' //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    //unban the target
    const unban = await message.guild.bans.remove(target.id, `{HYPER} ${reason}`).catch(err => {
        ReplyErrorMessage(message, `An Error occured, and ${BanLogs.target.username} was not unbanned`);
        return false
    });

    //check if action was succesfull
    if (unban != false) {
        //verify that the user has been unbanned
        message.reply(`**${BanLogs.target.username}** has been unbanned from the server`).catch((err) => { });
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
    name: 'unban',
    alias: [],
    category: 'management',
    desc: 'Revoke ban from target member',
    usage: '{prefix}unban @user',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'userId',
        type: 'STRING',
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