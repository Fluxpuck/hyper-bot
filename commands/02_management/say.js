/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { ReplyErrorMessage } = require("../../utils/MessageManager");
const { textchannels } = require('../../config/config.json');
const { Collection } = require("discord.js");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments or no attachments
    if (arguments.length < 1 && message.attachments.size < 1) return message.reply('What should I say?');

    //get target channel
    const channel = message.guild.channels.cache.find(c => c.id == arguments[0].replace(/[^\w\s]/gi, ''))
    if (!channel) return ReplyErrorMessage(message, `#channel was not found`, 4800)
    if (textchannels.includes(channel.type) == false) return ReplyErrorMessage(message, `#channel is not a text channel`, 4800)

    //set message
    let toSayMessage = arguments.slice(1);

    //if there are attachments, add to message
    if (!message.attachments) message.attachments = new Collection()
    if (message.attachments.size >= 1) {
        if (toSayMessage.length >= 1) {
            //send message and file to target channel
            return channel.send(toSayMessage.join(' '), { files: Array.from(message.attachments.values()) })
        } else {
            //send file to target channel
            return channel.send({ files: Array.from(message.attachments.values()) })
        }
    } else {
        //send message to target channel
        return channel.send(toSayMessage.join(' '))
    }
}

//command information
module.exports.info = {
    name: 'say',
    alias: ['talk', 'chat'],
    category: 'management',
    desc: 'Make the bot talk in target channel',
    usage: '{prefix}say [channel] [input]',
}

//slash setup
module.exports.slash = {
    slash: true,
    options: [
        {
            name: 'channel',
            type: 'CHANNEL',
            description: 'Where should I talk?',
            required: true,
        },
        {
            name: 'text',
            type: 'STRING',
            description: 'What should the bot say?',
            required: true,
        }],
    permission: false
}