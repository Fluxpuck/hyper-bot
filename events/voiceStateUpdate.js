/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { MessageEmbed } = require("discord.js");
const { getModuleSettings } = require("../utils/PermissionManager");
const { getUserFromInput } = require("../utils/Resolver");

module.exports = async (client, oldMember, newMember) => {

    //setup member value for embed footer
    const logMember = await getUserFromInput(oldMember.guild, oldMember.id);

    //check if member joined a voicechannel
    if (oldMember.channelId == null && newMember.channelId != null) {
        //get module settings, proceed if true
        const voiceJoin = await getModuleSettings(oldMember.guild, 'voiceJoin');
        if (voiceJoin.state === 1 && voiceJoin.channel != null) {

            //construct message
            const logMessage = new MessageEmbed()
                .setAuthor({ name: logMember.user.tag, iconURL: logMember.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`<@${oldMember.id}> **joined** <#${newMember.channelId}>`)
                .setColor(embed.colour__lightblue)
                .setTimestamp()
                .setFooter({ text: `${logMember.user.id}` })

            //don't log in channels that are excepted from logging
            if (voiceJoin.exceptions.includes(newMember.channelId)) return;
            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(voiceJoin.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });
        }
        return;
    }

    //check if member changed a voicechannel
    if (oldMember.channelId != null && newMember.channelId != null) {
        //get module settings, proceed if true
        const voiceChange = await getModuleSettings(oldMember.guild, 'voiceChange');
        if (voiceChange.state === 1 && voiceChange.channel != null) {

            //construct message
            const logMessage = new MessageEmbed()
                .setAuthor({ name: logMember.user.tag, iconURL: logMember.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`<@${oldMember.id}> **switched** from <#${oldMember.channelId}> to <#${newMember.channelId}>`)
                .setColor(embed.colour__blue)
                .setTimestamp()
                .setFooter({ text: `${logMember.user.id}` })

            //don't log in channels that are excepted from logging
            if (voiceChange.exceptions.includes(oldMember.channelId)) return;
            if (voiceChange.exceptions.includes(newMember.channelId)) return;
            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(voiceChange.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });
        }
        return;
    }

    //check if member left a voicechannel
    if (oldMember.channelId != null && newMember.channelId == null) {
        //get module settings, proceed if true
        const voiceLeave = await getModuleSettings(oldMember.guild, 'voiceLeave');
        if (voiceLeave.state === 1 && voiceLeave.channel != null) {

            //construct message
            const logMessage = new MessageEmbed()
                .setAuthor({ name: logMember.user.tag, iconURL: logMember.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`<@${oldMember.id}> **left** <#${oldMember.channelId}>`)
                .setColor(embed.colour__darkblue)
                .setTimestamp()
                .setFooter({ text: `${logMember.user.id}` })

            //don't log in channels that are excepted from logging
            if (voiceLeave.exceptions.includes(oldMember.channelId)) return;
            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(voiceLeave.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });
        }
        return;
    }

    return;

}