/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, guild, user) => {

    //get module settings, proceed if true
    const banRevokeModule = await getModuleSettings(guild, 'banRevoke');
    if (banRevokeModule.state === 1 && banRevokeModule.channel != null) {

        //fetch log, and if nessesary, save to database
        const AuditLog = await getAuditLogDetails(guild, 'GUILD_BAN_ADD', null);

        //construct message
        const logMessage = new MessageEmbed()
            .setTitle(`${AuditLog.target.username} is Unbanned`)
            .setDescription(`Unban was executed by <@${AuditLog.executor.id}> - ${AuditLog.executor.id}`)
            .addFields({ name: `Reason`, value: `\`\`\`${AuditLog.reason}\`\`\``, inline: false })
            .setTimestamp()
            .setFooter({ text: `${AuditLog.log.id}` })

        //get target channel and send message embed
        const targetChannel = message.guild.channels.cache.get(banRevokeModule.channel);
        if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

    }

    return;

}