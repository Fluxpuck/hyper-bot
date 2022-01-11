/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { FetchHyperLogs, getAuditLogDetails } = require('../utils/AuditManager');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, member) => {

    //get module settings, proceed if true
    const guildLeave = await getModuleSettings(member.guild, 'guildLeave');
    if (guildLeave.state === 1 && guildLeave.channel != null) {

        //fetch Audit & Hyper logs
        const HyperLogs = await FetchHyperLogs(message, member);

        //construct message
        const logMessage = new MessageEmbed()
            .setTitle(`Member Left :     ${member.user.tag}     (${HyperLogs.length})`)
            .setDescription(`<@${member.user.id}>  -  ${member.user.id}`)
            .addFields(
                { name: `Registered`, value: `${new Date(member.user.createdAt).toUTCString()}`, inline: false },
                { name: `Joined server`, value: `${new Date(member.joinedTimestamp).toUTCString()}`, inline: false }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(embed.colour__red)
            .setTimestamp()
            .setFooter({ text: `${member.user.id}` })

        //get target channel and send message embed
        const targetChannel = message.guild.channels.cache.get(guildLeave.channel);
        if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

    }

    //get module settings, proceed if true
    const kick = await getModuleSettings(member.guild.id, 'kick');
    if (kick.state === 1 && kick.channel != null) {
        //fetch log, and if nessesary, save to database
        const AuditLog = await getAuditLogDetails(guild, 'MEMBER_KICK', null);
        if (AuditLog != false) {

            //construct message
            const logMessage = new MessageEmbed()
                .setTitle(`${AuditLog.target.username} is Kicked`)
                .setDescription(`Kick was executed by <@${AuditLog.executor.id}> - ${AuditLog.executor.id}`)
                .addFields({ name: `Reason`, value: `\`\`\`${AuditLog.reason}\`\`\``, inline: false })
                .setColor(embed.colour__red)
                .setTimestamp()
                .setFooter({ text: `${AuditLog.log.id}` })

            //get target channel and send message embed
            const targetChannel = message.guild.channels.cache.get(kick.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

        }
    }

    //remove user from status table
    //remove user from away table

    return;
}