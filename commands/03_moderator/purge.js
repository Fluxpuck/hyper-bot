/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const { createHyperLog } = require("../../utils/AuditManager");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getModuleSettings } = require("../../utils/PermissionManager");
const { inputType, getUserMessages } = require("../../utils/Resolver")

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    const oldMessage = message; //save for original author, execution logging
    const interaction = (message.interaction) ? message.interaction : undefined;
    if (interaction) message = await interaction.fetchReply();

    //delete command message
    if (!interaction) setTimeout(() => message.delete(), 100);

    //divide the input {amount, user}
    const { amount, member } = input = await inputType(message.guild, arguments.slice(0, 2))

    //if any of two not provide, return error
    if (amount == null) return ReplyErrorMessage(oldMessage, 'Amount was not provied', 4800);
    if (member == false) return ReplyErrorMessage(oldMessage, '@user was not found', 4800);

    //check if target is moderator
    // if (member.permissions.has('KICK_MEMBERS')) return ReplyErrorMessage(message, '@user is a moderator', 4800);

    //check and parse amount/limit
    const limit = parseInt(amount)
    if (isNaN(limit)) return ReplyErrorMessage(oldMessage, `Doesn't seem to be a valid number`, 4800)
    if (limit > 100 || limit < 2) return ReplyErrorMessage(oldMessage, `Provide an amount between 1 and 100`, 4800)

    //get the message collection (limit 100)
    let collection = await getUserMessages(message, member, limit)

    //check if collection hold messages
    if (collection.size > 0) {
        //try and delete collection
        try { await message.channel.bulkDelete(collection, true); }
        catch (err) { return ReplyErrorMessage(oldMessage, `An Error occured, could not delete ${collection.size} messages`, 4800) }
    } else {
        return ReplyErrorMessage(oldMessage, `Could not find any messages to delete`, 4800)
    }

    //delete message and verify that the messages have been deleted
    if (interaction) interaction.editReply({ content: `**${collection.size}** messages have been deleted`, ephemeral: true });
    // else message.reply(`**${collection.size}** messages have been deleted`);

    //get module settings, proceed if true
    const moderationAction = await getModuleSettings(message.guild, 'moderationAction');
    if (moderationAction.state === 1 && moderationAction.channel != null) {
        //don't log in channels that are excepted from logging
        if (moderationAction.exceptions.includes(message.channel.id)) return;
        return SendModerationActionMessage(oldMessage, module.exports.info.name, moderationAction.channel)
    }
    return;
}


//command information
module.exports.info = {
    name: 'purge',
    alias: ['delete'],
    category: 'moderation',
    desc: 'Removes X messages from target member',
    usage: '{prefix}purge @user [amount]',
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
        name: 'amount',
        type: 'NUMBER',
        description: 'Amount of messages',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}