/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { MessageEmbed } = require('discord.js');

module.exports = async (client, oldMessage, newMessage) => {

    //ignore direct messages
    if (!oldMessage.guild) return;
    if (!newMessage.guild) return;
    //ignore messages from bot
    if (newMessage.author.id == client.user.id) return;
    if (oldMessage.author.bot == true) return;

    //get module settings, proceed if true
    const messageChange = await getModuleSettings(oldMessage.guild, 'messageChange');
    if (messageChange.state === 1 && messageChange.channel != null) {

        //construct message content (check if it's too long (1024))
        let oldMessage_raw = oldMessage.content.replace(/`/gi, '')
        let oldMessage_content = oldMessage_raw.length > 1024 ? oldMessage_raw.slice(0, 1000) : oldMessage_raw
        if (oldMessage_raw.length > 1024) oldMessage_content += '...'
        let newMessage_raw = newMessage.content.replace(/`/gi, '')
        let newMessage_content = newMessage_raw.length > 1024 ? newMessage_raw.slice(0, 1000) : newMessage_raw
        if (newMessage_raw.length > 1024) newMessage_content += '...'

        //filter if old and new message content are the same
        if (oldMessage_content == newMessage_content) return

        //construct message
        const logMessage = new MessageEmbed()
            .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL({ dynamic: false }) })
            .setDescription(`<@${oldMessage.author.id}> **changed** their [message](https://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${newMessage.id} 'Link to ${oldMessage.author.username}'s message') in <#${oldMessage.channelId}>
            \`\`\`OLD MESSAGE: ${oldMessage_content}\`\`\` \`\`\`NEW MESSAGE: ${newMessage_content}\`\`\``)
            .setColor(embed.colour__yellow)
            .setTimestamp()
            .setFooter({ text: `${oldMessage.author.id}` })

        //don't log in channels that are excepted from logging
        if (messageChange.exceptions.includes(oldMessage.channelId) == false) {
            //get target channel and send message embed
            const targetChannel = oldMessage.guild.channels.cache.get(messageChange.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });
        }
    }
    return;
}