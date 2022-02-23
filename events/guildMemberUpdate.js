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

module.exports = async (client, oldMember, newMember, pendingTimeout) => {

    //get all member details
    const member = await getUserFromInput(oldMember.guild, oldMember.user.id);

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
            if (targetChannel) targetChannel.send({ embeds: [logMessage] });
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
            if (targetChannel) targetChannel.send({ embeds: [logMessage] });
        }
    }

    //setup member roles
    const oldMember_roles = oldMember._roles;
    const newMember_roles = newMember._roles;
    const jailId = oldMember.guild.jailId;

    //check if member got muted (old way)
    if (oldMember_roles.length < newMember_roles.length
        && newMember.isCommunicationDisabled() === false) {
        //check if newMember has jailId, and oldMember doesn't
        if (!oldMember_roles.includes(jailId) && newMember_roles.includes(jailId)) {

            //fetch log, and if nessesary, save to database
            const AuditLog = await getAuditLogDetails(client, oldMember.guild, 'MEMBER_ROLE_UPDATE', 10);

            //get module settings, proceed if true
            const mute = await getModuleSettings(oldMember.guild, 'mute');
            if (mute.state === 1 && mute.channel != null) {

                //if auditlog is not false, log time out
                if (AuditLog != false) {

                    //construct message
                    const logMessage = new MessageEmbed()
                        .setTitle(`${AuditLog.target.username} is Muted for ${AuditLog.duration} ${AuditLog.duration > 1 ? 'minutes' : 'minute'}`)
                        .setDescription(`Mute was executed by <@${AuditLog.executor.id}> - ${AuditLog.executor.id}`)
                        .addFields({ name: `Reason`, value: `\`\`\`${AuditLog.reason}\`\`\``, inline: false })
                        .setColor(embed.colour__red)
                        .setTimestamp()
                        .setFooter({ text: `${AuditLog.log.id}` })

                    //get target channel and send message embed
                    const targetChannel = oldMember.guild.channels.cache.get(mute.channel);
                    if (targetChannel) targetChannel.send({ embeds: [logMessage] });

                }
            }

        }
    }

    //check if member unmuted (old way)
    if (oldMember_roles.length > newMember_roles.length
        && oldMember.isCommunicationDisabled() === true) {
        //check if newMember has jailId, and oldMember doesn't
        if (!newMember_roles.includes(jailId) && oldMember_roles.includes(jailId)) {

            //get module settings, proceed if true
            const muteRevoke = await getModuleSettings(oldMember.guild, 'muteRevoke');
            if (muteRevoke.state === 1 && muteRevoke.channel != null) {

                //construct message
                const logMessage = new MessageEmbed()
                    .setTitle(`${oldMember.user.tag} Mute is revoked`)
                    .setDescription(`<@${oldMember.user.id}> - ${oldMember.user.tag}`)
                    .setColor(embed.colour__blue)
                    .setTimestamp()
                    .setFooter({ text: `${oldMember.user.id}` })

                //get target channel and send message embed
                const targetChannel = oldMember.guild.channels.cache.get(muteRevoke.channel);
                if (targetChannel) targetChannel.send({ embeds: [logMessage] });

            }

        }
    }

    //setup timeout values
    const newTimeout = newMember.communicationDisabledUntilTimestamp != null ? new Date(newMember.communicationDisabledUntilTimestamp) : null;
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp != null ? new Date(oldMember.communicationDisabledUntilTimestamp) : null;

    //check if member got TimedOut
    if (oldMember.isCommunicationDisabled() == false
        && newMember.isCommunicationDisabled() == true) {

        console.log('Timeout!')

        //check if there is a pending mute available
        const pendingMute = await checkPendingMute(oldMember.guild.id, newMember.user.id);
        if (pendingMute == false) {

            //calculate timeout time, rounded to nearest 1000's
            const duration = ((newTimeout - Date.now()) / 1000).toFixed() * 1000;
            const muteTime = new Number(duration) / 1000 / 60;

            //fetch log, and if nessesary, save to database
            const AuditLog = await getAuditLogDetails(client, oldMember.guild, 'MEMBER_UPDATE', muteTime);

            //add pending mute to database
            await savePendingMute(oldMember.guild.id, oldMember.user.id, newTimeout);

            //add jail role to member, if available
            if (jailId != null) { //give jail role to member
                try { await member.roles.add(jailId, `Timeout for ${muteTime} ${AuditLog.duration > 1 ? 'minutes' : 'minute'}`); }
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
                    if (targetChannel) targetChannel.send({ embeds: [logMessage] });

                }
            }
        }

    }

    //check if TimeOut is removed Manually
    if (oldMember.isCommunicationDisabled() == true
        && newMember.isCommunicationDisabled() == false) {

        //remove jail role to member, if available
        if (jailId != null) { //give jail role to member
            try { await member.roles.remove(jailId, `Timeout revoked manually`); }
            catch (error) { }
        }

        //check if there is a pending mute available
        const pendingMute = await checkPendingMute(oldMember.guild.id, newMember.user.id);
        if (pendingMute != false) {

            //remove pending mute from database
            await removePendingMute(oldMember.guild.id, oldMember.user.id);

            //get module settings, proceed if true
            const timeoutRevoke = await getModuleSettings(oldMember.guild, 'timeoutRevoke');
            if (timeoutRevoke.state === 1 && timeoutRevoke.channel != null) {

                //construct message
                const logMessage = new MessageEmbed()
                    .setTitle(`${oldMember.user.tag} Time out is revoked manually`)
                    .setDescription(`<@${oldMember.user.id}> - ${oldMember.user.tag}`)
                    .setColor(embed.colour__blue)
                    .setTimestamp()
                    .setFooter({ text: `${oldMember.user.id}` })

                //get target channel and send message embed
                const targetChannel = oldMember.guild.channels.cache.get(timeoutRevoke.channel);
                if (targetChannel) targetChannel.send({ embeds: [logMessage] });

            }
        }
    }

    //check if TimeOut is removed Automatically
    if (pendingTimeout != undefined &&
        new Date(pendingTimeout) - Date.now() < 0) {

        //remove jail role to member, if available
        if (jailId != null) { //give jail role to member
            try { await member.roles.remove(jailId, `Timeout revoked automatically`); }
            catch (error) { }
        }

        //check if there is a pending mute available
        const pendingMute = await checkPendingMute(oldMember.guild.id, newMember.user.id);
        if (pendingMute != false) {

            //remove pending mute from database
            await removePendingMute(oldMember.guild.id, oldMember.user.id);

            //get module settings, proceed if true
            const timeoutRevoke = await getModuleSettings(oldMember.guild, 'timeoutRevoke');
            if (timeoutRevoke.state === 1 && timeoutRevoke.channel != null) {

                //construct message
                const logMessage = new MessageEmbed()
                    .setTitle(`${oldMember.user.tag} Time out is revoked automatically`)
                    .setDescription(`<@${oldMember.user.id}> - ${oldMember.user.tag}`)
                    .setColor(embed.colour__blue)
                    .setTimestamp()
                    .setFooter({ text: `${oldMember.user.id}` })

                //get target channel and send message embed
                const targetChannel = oldMember.guild.channels.cache.get(timeoutRevoke.channel);
                if (targetChannel) targetChannel.send({ embeds: [logMessage] });

            }
        }
    }

    return;
}