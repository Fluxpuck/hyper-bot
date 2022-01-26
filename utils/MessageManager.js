/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The MessageManager contains functions related to sending messages */

//load required modules
const { MessageEmbed } = require('discord.js');
const { capitalize } = require('./functions');

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

        //if interaction return emphameral
        if (message.slashinteraction == true) {
            return message.interaction.editReply({ embeds: [ErrorEmbed], ephemeral: true });
        } else if (timer) { //if timer is set return error message and remove
            return message.channel.send({ embeds: [ErrorEmbed] }).then(msg => { setTimeout(() => msg.delete(), timer); })
        } else { //if no timer is set, just return error message
            return message.channel.send({ embeds: [ErrorEmbed] })
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

        //if interaction return emphameral
        if (message.slashinteraction == true) {
            return message.interaction.editReply({ embeds: [ErrorEmbed], ephemeral: true });
        } else if (timer) { //if timer is set return error message and remove
            return message.reply({ embeds: [ErrorEmbed] })
                .then(msg => { setTimeout(() => msg.delete(), timer); })
        } else { //if no timer is set, just return error message
            return message.reply({ embeds: [ErrorEmbed] })
        }
    },

    /** Send DM (direct message) to user
     * @param {*} message Message object
     * @param {*} input Message
     * @param {object} target Member
     */
    async SendWarningMessageDM(client, message, input, target) {
        //create the embed message
        const warn_embed = new MessageEmbed()
            .setTitle(`Warning - ${message.guild.name}`)
            .setDescription(`You have received a __warning__ in **${message.guild.name}**`)
            .addFields({ name: `Reason for warning`, value: `\`\`\`${input}\`\`\`` })
            .setThumbnail(embed.warning_thumb)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} | hyperbot.cc` })

        //setup warning message
        let warning = { status: true, message: `${target.user.tag} has recieved a warning` };

        //send message through DM
        await target.send({ embeds: [warn_embed] }).catch(err => {
            if (err) warning = { status: false, message: `Could not deliver message to ${target.user.tag}` };
        })

        //return status
        return warning;
    },

    /** Send Mod Action log to specified channel
     * @param {*} message 
     * @param {*} command 
     * @param {*} channel 
     */
    async SendModerationActionMessage(message, command, channel) {
        //create the embed message
        const embedMessage = new MessageEmbed()
            .setDescription(`<@${message.author.id}> executed the **${capitalize(command)}** command`)
            .setColor(embed.color)
            .setTimestamp()
            .setFooter({ text: `${message.author.id}`, iconURL: message.author.displayAvatarURL({ dynamic: false }) })

        //get target channel and send message embed
        const targetChannel = message.guild.channels.cache.get(channel);
        if (targetChannel) return targetChannel.send({ embeds: [embedMessage] });
    },

    /** Send No Activation message to guild
     * @param {*} client 
     * @param {*} message 
     * @param {*} timer 
     */
    async HandshakeMessage(message, timer) {
        //check if a remove timer is set!
        if (timer) { //if timer is set return error message and remove
            return message.reply(`**Hold up!** I've not been \`activated\` yet.`)
                .then(msg => { setTimeout(() => msg.delete(), timer); })
        } else { //if no timer is set, just return error message
            return message.reply(`**Hold up!** I've not been \`activated\` yet.`)
        }
    }

}