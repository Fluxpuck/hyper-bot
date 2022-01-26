/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const { createHyperLog } = require("../../utils/AuditManager");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getModuleSettings } = require("../../utils/PermissionManager");
const { inputType, getUserMessages } = require("../../utils/Resolver")

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //delete command message
    if (!message.interaction) setTimeout(() => message.delete(), 100);

    //if there are no arguments, no amount has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'Amount was not provided', 4800);

    //check and parse amount/limit
    const limit = parseInt(arguments[0])
    if (isNaN(limit)) return ReplyErrorMessage(message, `Doesn't seem to be a valid number`, 4800)
    if (limit > 100 || limit < 2) return ReplyErrorMessage(message, `Provide an amount between 1 and 100`, 4800)

    //get the message collection (limit 100)
    let collection = await getUserMessages(message, undefined, limit)

    //check if collection hold messages
    if (collection.size > 0) {
        //try and delete collection
        try { await message.channel.bulkDelete(collection, true); }
        catch (err) { return ReplyErrorMessage(message, `An Error occured, could not delete ${collection.size} messages`, 4800) }
    } else {
        return ReplyErrorMessage(message, `Could not find any messages to delete`, 4800)
    }

    //delete message and verify that the messages have been deleted
    if (message.interaction) message.interaction.editReply({ content: `**${collection.size}** messages have been deleted`, ephemeral: true });
    // message.reply(`**${collection.size}** messages have been deleted`);

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
    name: 'clean',
    alias: ['clear'],
    category: 'moderation',
    desc: 'Removes X messages from channel',
    usage: '{prefix}clean [amount]',
}

//slash setup
module.exports.slash = {
    slash: true,
    options: [{
        name: 'amount',
        type: 'NUMBER',
        description: 'Amount of messages',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}