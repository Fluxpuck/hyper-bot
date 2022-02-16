/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//require packages
const moment = require('moment');
const { getAllStatus, updateStatusDashboard } = require("../database/QueryManager");
const { clean } = require('../utils/functions');
const { loadGuildConfiguration } = require('../utils/PermissionManager');

module.exports = async (client) => {

    //go through each guild
    Array.from(client.guilds.cache.values()).forEach(async guild => {

        //check if dashboard has been setup
        if (guild.statusId === null) return;

        //get channelId and messageId
        const channelId = guild.statusId.split('/')[0];
        const messageId = guild.statusId.split('/')[1];

        //get channel and message
        const channel = await guild.channels.cache.get(channelId);
        var message = await channel.messages.fetch(messageId);

        //await for statusses from database
        const pendingStatus = await getAllStatus(guild.id);
        if (pendingStatus.length <= 0) return;

        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setTitle(`STATUS DASHBOARD`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: false }))
            .setColor(embed.color)
            .setTimestamp()
            .setFooter({ text: `Last update` })

        //go over all statusses and insert into embed message
        for await (let status of pendingStatus) {

            //setup away time date
            const awaySince = moment(status.date);
            const awayFor = (awaySince.fromNow()).toString();

            //add individual status to dashboard
            messageEmbed
                .addField(`${status.memberName} :     ${awayFor}`, `\`\`\`${clean(client, status.status)}\`\`\``, false)

        }

        //if no messageId is unavailable, send a message
        if (!messageId) {

            //send status dashboard
            message = await channel.send({ embeds: [messageEmbed] });

            //update statusId in database
            const statusId = `${guild.statusId}/${message.id}`
            await updateStatusDashboard(guild.id, statusId)
            //reload cached permissions
            return loadGuildConfiguration(guild);
        }
        //if messageId is available, update message
        if (messageId) {
            //edit message
            return message.edit({ embeds: [messageEmbed] });
        }
    })
    return;
}