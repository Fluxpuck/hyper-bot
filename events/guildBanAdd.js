/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { MessageEmbed } = require("discord.js");
const { getAuditLogDetails } = require("../utils/AuditManager");
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, ban) => {

    //construct info from ban info
    const { guild, user } = ban

    //get module settings, proceed if true
    const banModule = await getModuleSettings(guild, 'ban');
    if (banModule.state === 1 && banModule.channel != null) {

        //fetch log, and if nessesary, save to database
        const AuditLog = await getAuditLogDetails(client, guild, 'GUILD_BAN_ADD', null);
        if (AuditLog != false) {

            //construct message
            const logMessage = new MessageEmbed()
                .setTitle(`${user.username} is Banned`)
                .setDescription(`Ban was executed by <@${AuditLog.executor.id}> - ${AuditLog.executor.id}`)
                .addFields({ name: `Reason`, value: `\`\`\`${AuditLog.reason}\`\`\``, inline: false })
                .setColor(embed.colour__red)
                .setTimestamp()
                .setFooter({ text: `${AuditLog.log.id}` })

            //get target channel and send message embed
            const targetChannel = guild.channels.cache.get(banModule.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] }).catch((err) => { });

        }
    }
    return;
}