/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//require modules
const { deactivateGuild, emptyPendingMutes } = require("../database/QueryManager")

//require config
const { reportChannel } = require('../config/config.json');

module.exports = async (client, guild) => {

    //remove handshake & empty pending mutes
    await deactivateGuild(guild.id);
    await emptyPendingMutes(guild.id);

    //create reportEmbed
    const reportEmbed = new MessageEmbed()
        .setTitle(`${client.user.tag} left ${guild.name}`)
        .addFields(
            { name: 'Guild Owner', value: `<@${guild.ownerId}> | ${guild.ownerId}`, inline: false },
            { name: 'Member Count', value: `\`\`\`${guild.memberCount}\`\`\``, inline: true },
            { name: 'Region', value: `\`\`\`${guild.region}\`\`\``, inline: true },
            { name: 'Guild Created at', value: `\`\`\`${guild.createdAt.toLocaleString()}\`\`\``, inline: false },
        )
        .setThumbnail(guild.iconURL())
        .setColor(embed.color)
        .setTimestamp()
        .setFooter({ text: `${guild.id}` })

    //get report channel and send report embed
    client.channels.fetch(reportChannel)
        .then(channel => channel.send({ embeds: [reportEmbed] }))

    return;
}