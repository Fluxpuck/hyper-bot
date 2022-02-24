/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {

    //construct guild prefix
    const prefix = message.guild.prefix;

    //ignore filters
    if (!message.guild) return; //ignore direct messages
    if (message.author.bot == true) return; //ignore messages from other bots
    if (message.author.id == client.user.id) return; //ignore messages from client
    if (message.content.startsWith(prefix)) return; //ignore bot command messages

    //get module settings, proceed if true
    const messageDelete = await getModuleSettings(message.guild, 'messageDelete');
    if (messageDelete.state === 1 && messageDelete.channel != null) {

        //define message content
        const deleted_content_raw = message.content.replace(/`/gi, '')
        let deleted_content = deleted_content_raw.length > 0 ? deleted_content_raw : false
        //construct message content (check if it's too long (1024))
        if (deleted_content != false) {
            deleted_content = deleted_content_raw.length > 1024 ? deleted_content_raw.slice(0, 1000) : deleted_content_raw
            if (deleted_content_raw.length > 1024) deleted_content += '...'
        }

        //define message attachments
        const deleted_attachments_array = message.attachments.map(m => m)
        let deleted_attachment = deleted_attachments_array.length > 0 ? deleted_attachments_array[0] : false

        //construct message
        const logMessage = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: false }) })
            .setDescription(`Message from <@${message.author.id}> is **deleted** from <#${message.channelId}>`)
            .setColor(embed.colour__darkred)
            .setTimestamp()
            .setFooter({ text: `${message.author.id}` })

        //check deletes message content
        if (deleted_content == false && deleted_attachment != false) { //if deletes message got image and no text
            //change embed construction
            logMessage.addFields({ name: 'Deleted Image', value: "-", inline: false })
            logMessage.setImage(deleted_attachment.proxyURL)

        } else if (deleted_content != false && deleted_attachment == false) { //if deletes message got text and no image
            //change embed construction
            logMessage.addFields({ name: 'Deleted Message', value: `\`\`\`MESSAGE: ${deleted_content}\`\`\``, inline: false })
            logMessage.setImage(deleted_attachment.proxyURL)
        } else if (deleted_content != false && deleted_attachment != false) { //if deletes message got both image and text
            //change embed construction
            logMessage.addFields({ name: 'Deleted Content', value: `\`\`\`MESSAGE: ${deleted_content}\`\`\``, inline: false })
            logMessage.setImage(deleted_attachment.proxyURL)
        }

        //don't log in channels that are excepted from logging
        if (messageDelete.exceptions.includes(message.channelId) == false) {
            //get target channel and send message embed
            const targetChannel = message.guild.channels.cache.get(messageDelete.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] }).catch((err) => { });
        }
    }
    return;
}