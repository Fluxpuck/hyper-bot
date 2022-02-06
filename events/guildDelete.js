/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

const { MessageEmbed } = require("discord.js")
const { deactivateGuild, emptyPendingMutes } = require("../database/QueryManager")

module.exports = async (client, guild) => {

    //remove handshake & empty pending mutes
    await deactivateGuild(guild.id);
    await emptyPendingMutes(guild.id);

    //create reportEmbed
    let reportEmbed = new MessageEmbed()
        .setTitle(`${client.user.tag} left ${guild.name}`)
        .addFields(
            { name: 'Guild Owner', value: `\`\`\`${guild.owner.user.tag} | ${guild.owner.user.id}\`\`\``, inline: false },
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