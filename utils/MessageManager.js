/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The MessageManager contains functions related to sending messages */

//load required modules
const { MessageEmbed } = require('discord.js');

//import styling from assets
const emote = require('../assets/emotes.json');
const embed = require('../assets/embed.json');

module.exports = {

    /** Sends Error message to the message channel
    * @param {String} message Message object
    * @param {String} input Error message input
    * @param {String} timer Timeout
    */
    async SendErrorMessage(message, input, timer) {
        //create error embed
        let ErrorEmbed = new MessageEmbed()
            .setDescription(`${emote.error} ${input}`)
            .setColor(embed.errorColor)

        //check if a remove timer is set!
        if (timer) { //if timer is set return error message and remove
            return message.channel.send(ErrorEmbed).then(msg => { setTimeout(() => msg.delete(), timer); })
        } else { //if no timer is set, just return error message
            return message.channel.send(ErrorEmbed)
        }
    },

    /** Reply with an error message
    * @param {String} message Message object
    * @param {String} input Error message input
    * @param {String} timer Timeout
    */
    async ReplyErrorMessage(message, input, timer) {
        //create error embed
        let ErrorEmbed = new MessageEmbed()
            .setDescription(`${emote.error} ${input}`)
            .setColor(embed.errorColor)

        //check if a remove timer is set!
        if (timer) { //if timer is set return error message and remove
            return message.reply({ embeds: [ErrorEmbed] }).then(msg => { setTimeout(() => msg.delete(), timer); })
        } else { //if no timer is set, just return error message
            return message.reply({ embeds: [ErrorEmbed] })
        }
    },

}