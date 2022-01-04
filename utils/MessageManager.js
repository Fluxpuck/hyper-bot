/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The MessageManager contains functions related to sending messages */

//load required modules
const { MessageEmbed } = require('discord.js');

//import styling from assets
const emote = require('../assets/emotes.json');
const embed = require('../assets/embed.json');

module.exports = {

    /** Construct Error message
    * @param {String} input Error message input
    */
    async ErrorMessage(input) {
        //create error embed
        let ErrorEmbed = new MessageEmbed()
            .setDescription(`${emote.error} ${input}`)
            .setColor(embed.errorColor)

        //check if a remove timer is set!
        return ErrorEmbed
    },

    /** Sends Error message to the message channel
    * @param {String} message Message object
    * @param {String} input Error message input
    * @param {String} timer Timeout
    */
    async SendErrorMessage(message, input, timer) {
        //create error embed
        let ErrorEmbed = await module.exports.ErrorMessage(input);

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
        let ErrorEmbed = await module.exports.ErrorMessage(input);

        //check if a remove timer is set!
        if (timer) { //if timer is set return error message and remove
            return message.reply({ embeds: [ErrorEmbed] }).then(msg => { setTimeout(() => msg.delete(), timer); })
        } else { //if no timer is set, just return error message
            return message.reply({ embeds: [ErrorEmbed] })
        }
    },

    /** Send DM (direct message) to user
     * @param {*} message Message object
     * @param {*} input Message
     * @param {object} target Member
     */
    async SendWarningMessageDM(message, input, target) {
        //create the embed message
        const warn_embed = new MessageEmbed()
            .setTitle(`Warning - ${message.guild.name}`)
            .setDescription(`You have received a __warning__ in **${message.guild.name}**`)
            .addFields({ name: `Reason for warning`, value: `\`\`\`${input}\`\`\`` })
            .setThumbnail(embed.warning_thumb)
            .setTimestamp()
            .setFooter(`${client.user.username} | hyperbot.cc`)

        //send message through DM
        await target.send({ embeds: [warn_embed] }).catch(err => {
            if (err) return { status: false, message: `Could not deliver message to ${target.user.tag}` };
        })

        //return status
        return { status: true, message: `${target.user.tag} has recieved a warning` };
    }

}