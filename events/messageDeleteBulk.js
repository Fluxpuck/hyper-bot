/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { MessageEmbed } = require('discord.js');

module.exports = async (client, messages) => {

    //get first message {guild} and other values
    const message = messages.first();

    //get module settings, proceed if true
    const messageBulkDelete = await getModuleSettings(message.guild, 'messageBulkDelete');
    if (messageBulkDelete.state === 1 && messageBulkDelete.channel != null) {

        //set length and channel value's
        const bulkMessages = messages.map(m => m);

        //setup message collection & filter out too long messages
        const bulkLimit = 10 //log max 10 messages
        let bulkCollection = bulkMessages.reverse()
        bulkCollection = bulkCollection.slice(0, bulkLimit).map(message => `[${message.author.tag}]: ${message.content.length > 40 ? `${message.content.slice(0, 40)}...` : message}`)


        //construct message
        const logMessage = new MessageEmbed()
            .setDescription(`**${bulkMessages.length}** messages are **deleted** from <#${message.channelId}>`)
            .addFields({ name: 'Deleted Content', value: `\`\`\`MESSAGES:\n${bulkCollection.join('\n')}\`\`\``, inline: false })
            .setColor(embed.colour__darkred)
            .setTimestamp()

        //if all messages are from same user, set Author and Footer
        if (bulkMessages.every(msg => msg.author.id === message.author.id)) {
            logMessage
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: false }) })
                .setDescription(`**${bulkMessages.length}** messages from <@${message.author.id}> are **purged** from <#${message.channelId}>`)
                .setFooter({ text: `${message.author.id}` })
        }

        //don't log in channels that are excepted from logging
        if (messageBulkDelete.exceptions.includes(message.channelId) == false) {
            //get target channel and send message embed
            const targetChannel = message.guild.channels.cache.get(messageBulkDelete.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] }).catch((err) => { });
        }
    }
    return;
}