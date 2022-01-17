/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { FetchHyperLogs } = require('../utils/AuditManager');

module.exports = async (client, member) => {

    //get module settings, proceed if true
    const guildJoin = await getModuleSettings(member.guild, 'guildJoin');
    if (guildJoin.state === 1 && guildJoin.channel != null) {

        //get a random welcome message
        const welcome_msg = require('../assets/welcome.json');
        let idx = Math.floor(Math.random() * welcome_msg.length);

        //construct message
        const logMessage = new MessageEmbed()
            .setAuthor({ name: `Welcome ${member.user.tag} - №${member.guild.memberCount}`, iconURL: member.user.displayAvatarURL({ dynamic: false }) })
            .setDescription(`\`\`\`${welcome_msg[idx].replace('{name}', `${member.user.tag}`)}\`\`\``)
            .setTimestamp()
            .setFooter({ text: `${member.user.id}` })

        //get target channel and send message embed
        const targetChannel = message.guild.channels.cache.get(guildJoin.channel);
        if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

    }

    //get module settings, proceed if true
    const guildWelcome = await getModuleSettings(member.guild.id, 'guildWelcome');
    if (guildWelcome.state === 1 && guildWelcome.channel != null) {

        //fetch Audit & Hyper logs
        const HyperLogs = await FetchHyperLogs(message.guild, member);

        //construct message
        const logMessage = new MessageEmbed()
            .setTitle(`Member Joined :     ${member.user.tag}     (${HyperLogs.length})`)
            .setDescription(`<@${member.user.id}>  -  ${member.user.id}`)
            .addField(`Account created on`, `${new Date(member.user.createdAt).toUTCString()}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(embed.colour__blue)
            .setTimestamp()
            .setFooter({ text: `${member.user.id}` })

        //get target channel and send message embed
        const targetChannel = message.guild.channels.cache.get(guildWelcome.channel);
        if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

    }

    //setup timeout value and check is member is still timed out
    const timeOut = member.communicationDisabledUntilTimestamp != null ? new Date(member.communicationDisabledUntilTimestamp) : null
    if (timeOut - Date.now() > 0) { //if member is still timed out

        //get jail-role
        //re-give jail-role to member

    }
    return;
}