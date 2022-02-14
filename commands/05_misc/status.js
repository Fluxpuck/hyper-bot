/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../../assets/embed.json');

//require modules
const { saveStatus, removeStatus } = require("../../database/QueryManager");
const { clean } = require("../../utils/functions");
const { ReplyErrorMessage } = require("../../utils/MessageManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, try and remove status
    if (arguments.length < 1) {
        //remove status from database
        await removeStatus(message.guild.id, message.author.id);
        //delete command message
        return setTimeout(() => message.delete(), 100);
    }

    //check for status message length
    if (arguments.length > 80) return ReplyErrorMessage(message, 'Status message was too long. Use a maximum of 80 characters', 4800);

    //setup status message
    const statusMessage = clean(client, arguments.join(' ').trim())

    //setup embed message
    const messageEmbed = new MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: false }) })
        .setDescription(`${statusMessage}`)
        .setColor(embed.color);

    //save or update status feature
    await saveStatus(message.guild.id, message.author.id, statusMessage);

    //return message to the user
    return message.reply({ content: `Your status has been set to:`, embeds: [messageEmbed] })
    // .then(msg => { setTimeout(() => msg.delete(), 2800) }); //delete message after

}

//command information
module.exports.info = {
    name: 'status',
    alias: [],
    category: 'misc',
    desc: 'Setup a status message',
    usage: '{prefix}status [message]',
}
//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'status',
        type: 'STRING',
        description: 'Status message',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
}