/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { MessageEmbed } = require('discord.js');
const { getAuditLogDetails } = require('../utils/AuditManager');

module.exports = async (client, unban) => {

    //construct info from unban info
    const { guild, user } = unban

    //get module settings, proceed if true
    const banRevokeModule = await getModuleSettings(guild, 'banRevoke');
    if (banRevokeModule.state === 1 && banRevokeModule.channel != null) {

        //fetch log, and if nessesary, save to database
        const AuditLog = await getAuditLogDetails(client, guild, 'GUILD_BAN_REMOVE', null);
        if (AuditLog != false && AuditLog != undefined) {

            //construct message
            const logMessage = new MessageEmbed()
                .setTitle(`${user.username} is Unbanned`)
                .setDescription(`Unban was executed by <@${AuditLog.executor.id}> - ${AuditLog.executor.id}`)
                .addFields({ name: `Reason`, value: `\`\`\`${AuditLog.reason}\`\`\``, inline: false })
                .setColor(embed.colour__blue)
                .setTimestamp()
                .setFooter({ text: `${AuditLog.log.id}` })

            //get target channel and send message embed
            const targetChannel = guild.channels.cache.get(banRevokeModule.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] }).catch((err) => { });

        }
    }
    return;
}