/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { getAuditLogDetails } = require('../utils/AuditManager');
const { savePendingMute, removePendingMute, checkPendingMute } = require('../database/QueryManager');
const { getUserFromInput } = require('../utils/Resolver');

module.exports = async (client, oldMember, newMember) => {

    //check if member changed their nickname
    if (oldMember.nickname !== newMember.nickname) {
        //get module settings, proceed if true
        const changeNickname = await getModuleSettings(oldMember.guild, 'changeNickname');
        if (changeNickname.state === 1 && changeNickname.channel != null) {

            //setup nickname values, and if undefined usernames
            const oldNickname = oldMember.nickname != undefined ? oldMember.nickname : oldMember.user.username
            const newNickname = newMember.nickname != undefined ? newMember.nickname : newMember.user.username

            //construct message
            const logMessage = new MessageEmbed()
                .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`<@${oldMember.user.id}> changed from **${oldNickname}** to **${newNickname}**`)
                .setColor(embed.colour__yellow)
                .setTimestamp()
                .setFooter({ text: `${oldMember.user.id}` })

            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(changeNickname.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });
        }
    }

    //check if member changed their avatar
    if (oldMember.avatar !== newMember.avatar) {
        //get module settings, proceed if true
        const changeAvatar = await getModuleSettings(oldMember.guild, 'changeAvatar');
        if (changeAvatar.state === 1 && changeAvatar.channel != null) {

            //construct message
            const logMessage = new MessageEmbed()
                .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`<@${oldMember.user.id}> changed their **avatar**`)
                .addFields({ name: `Avatar URL`, value: `${oldMember.user.displayAvatarURL()}`, inline: false })
                .setColor(embed.colour__yellow)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: false }))
                .setTimestamp()
                .setFooter({ text: `${oldMember.user.id}` })

            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(changeAvatar.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });
        }
    }

    //setup TimeOut values
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp != null ? new Date(oldMember.communicationDisabledUntilTimestamp) : null
    const newTimeout = newMember.communicationDisabledUntilTimestamp != null ? new Date(newMember.communicationDisabledUntilTimestamp) : null
    const member = await getUserFromInput(oldMember.guild, oldMember.user.id); //get member

    //new TimeOut, if new timeout time is in the future
    if (newTimeout - Date.now() > 0) {

        //check if there is a pending mute available
        const pendingMute = await checkPendingMute(oldMember.guild.id, newMember.user.id);
        if (pendingMute != false) return;

        //calculate timeout time, rounded to nearest 1000's
        const duration = ((newTimeout - Date.now()) / 1000).toFixed() * 1000;
        const muteTime = new Number(duration) / 1000 / 60;

        //fetch log, and if nessesary, save to database
        const AuditLog = await getAuditLogDetails(oldMember.guild, 'MEMBER_UPDATE', muteTime);

        //add pending mute to database
        await savePendingMute(oldMember.guild.id, oldMember.user.id, newTimeout);

        //add jail role to member, if available
        if (oldMember.guild.jailId != null) { //give jail role to member
            try { await member.roles.add(oldMember.guild.jailId, `Timeout for ${muteTime} ${AuditLog.duration > 1 ? 'minutes' : 'minute'}`); }
            catch (error) { }
        }

        //get module settings, proceed if true
        const timeout = await getModuleSettings(oldMember.guild, 'timeout');
        if (timeout.state === 1 && timeout.channel != null) {
            //if auditlog is not false, log time out
            if (AuditLog != false) {

                //construct message
                const logMessage = new MessageEmbed()
                    .setTitle(`${AuditLog.target.username} is Timed out for ${AuditLog.duration} ${AuditLog.duration > 1 ? 'minutes' : 'minute'}`)
                    .setDescription(`Time out was executed by <@${AuditLog.executor.id}> - ${AuditLog.executor.id}`)
                    .addFields({ name: `Reason`, value: `\`\`\`${AuditLog.reason}\`\`\``, inline: false })
                    .setColor(embed.colour__red)
                    .setTimestamp()
                    .setFooter({ text: `${AuditLog.log.id}` })

                //get target channel and send message embed
                const targetChannel = oldMember.guild.channels.cache.get(timeout.channel);
                if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

            }
        }
    }

    //remove TimeOut, if timeout time is in the past
    if (new Date(newTimeout) - Date.now() < 0) {

        //remove jail role to member, if available
        if (oldMember.guild.jailId != null) { //give jail role to member
            try { await member.roles.remove(oldMember.guild.jailId, `Timeout revoked`); }
            catch (error) { }
        }

        //check if there is a pending mute available
        const pendingMute = await checkPendingMute(oldMember.guild.id, newMember.user.id);
        if (pendingMute == false) return;

        //remove pending mute from database
        await removePendingMute(oldMember.guild.id, oldMember.user.id);

        //get module settings, proceed if true
        const timeoutRevoke = await getModuleSettings(oldMember.guild, 'timeoutRevoke');
        if (timeoutRevoke.state === 1 && timeoutRevoke.channel != null) {

            //construct message
            const logMessage = new MessageEmbed()
                .setTitle(`${oldMember.user.tag} Time out is revoked`)
                .setDescription(`<@${oldMember.user.id}> - ${oldMember.user.tag}`)
                .setColor(embed.colour__blue)
                .setTimestamp()
                .setFooter({ text: `${oldMember.user.id}` })

            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(timeoutRevoke.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

        }

    }
    return;
}