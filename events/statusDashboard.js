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
        if (guild.statusId === undefined) return;

        //if value can be split
        var channelId, messageId;
        if (guild.statusId.includes('/')) {
            //set channelId and messageId
            channelId = guild.statusId.split('/')[0];
            messageId = guild.statusId.split('/')[1];
        } else {
            //set channelId
            channelId = guild.statusId;
        }

        //get channel and message
        const channel = await guild.channels.cache.get(channelId);
        var message = await channel.messages.fetch(messageId);

        //await for statusses from database
        const pendingStatus = await getAllStatus(guild.id);
        //order array based on date
        const sortedStatus = pendingStatus.sort((a, b) => b.date - a.date);

        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setTitle(`STATUS DASHBOARD`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: false }))
            .setColor(embed.color)
            .setTimestamp()
            .setFooter({ text: `Last update` })

        //empty all fields, before updating it again
        messageEmbed.fields = []

        //go over all statusses and insert into embed message
        for await (let status of sortedStatus) {
            //setup away time date
            const awaySince = moment(status.date).subtract(1, 'h');
            const awayFor = awaySince.fromNow();

            //add individual status to dashboard
            messageEmbed.addField(`${status.memberName} :     ${awayFor}`, `\`\`\`${clean(client, status.status)}\`\`\``, false)
        }

        //add message if pendingStatus array is empty
        if (pendingStatus.length <= 0) {
            //add individual status to dashboard
            messageEmbed.addField(`It's kinda empty in here...`, `Seems like no one has set a status`, false)
        }

        //if no messageId is unavailable, send a message
        if (!messageId) {
            //send status dashboard
            message = await channel.send({ embeds: [messageEmbed] }).catch((err) => { })
            //update statusId in database
            const statusId = `${guild.statusId}/${message.id}`
            await updateStatusDashboard(guild.id, statusId)
            //reload cached permissions
            return loadGuildConfiguration(guild);
        }
        //if messageId is available, update message
        if (messageId) {
            //edit message
            return message.edit({ embeds: [messageEmbed] }).catch((err) => { })
        }
    })
    return;
}