/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const { chunk } = require("../../utils/functions");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getModuleSettings } = require("../../utils/PermissionManager");
const { getUserMessages } = require("../../utils/Resolver")

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //setup and change some values for interaction
    const oldMessage = message; //save for original author, execution logging
    const interaction = (message.interaction) ? message.interaction : undefined;
    if (interaction) message = await interaction.fetchReply();

    //delete command message
    if (!interaction) setTimeout(() => message.delete().catch((err) => { }), 100)

    //if there are no arguments, no amount has been defined
    if (arguments.length < 1) return ReplyErrorMessage(oldMessage, 'Amount was not provided', 4800);

    //check and parse amount/limit
    const limit = parseInt(arguments[0])
    if (isNaN(limit)) return ReplyErrorMessage(oldMessage, `Doesn't seem to be a valid number`, 4800)
    if (limit > 1000 || limit < 2) return ReplyErrorMessage(oldMessage, `Provide an amount between 1 and 1000`, 4800)

    //get the message collection (limit 100)
    let collection = await getUserMessages(oldMessage, undefined, limit)

    //check if collection hold messages
    if (collection.size > 0) {
        //check collection size, if above 100, bulkdelete in chunks of 100
        if (collection.size > 100) {
            //devide collection into chunks of 100 messages
            const messageCollection = Array.from(collection.values());
            const messageChunks = chunk(messageCollection, 100);
            //bulk delete messages in chunks of 100 messages
            for await (let chunk of messageChunks) {
                try { await message.channel.bulkDelete(chunk, true); }
                catch (err) { return ReplyErrorMessage(oldMessage, `An Error occured, could not delete ${collection.size} messages`, 4800) }
            }
        } else {
            //try and delete collection
            try { await message.channel.bulkDelete(collection, true); }
            catch (err) { return ReplyErrorMessage(oldMessage, `An Error occured, could not delete ${collection.size} messages`, 4800) }
        }
    } else {
        return ReplyErrorMessage(oldMessage, `Could not find any messages to delete`, 4800)
    }

    //delete message and verify that the messages have been deleted
    if (interaction) interaction.editReply({ content: `**${collection.size}** messages have been deleted`, ephemeral: true });
    // else message.reply(`**${collection.size}** messages have been deleted`).catch((err) => { });

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