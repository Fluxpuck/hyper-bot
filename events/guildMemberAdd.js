/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");
const { FetchHyperLogs } = require('../utils/AuditManager');
const { MessageEmbed } = require('discord.js');
const { checkPendingMute } = require('../database/QueryManager');
const { getUserFromInput } = require('../utils/Resolver');

module.exports = async (client, member) => {

    //fetch member
    await getUserFromInput(member.guild, member.id);

    //get module settings, proceed if true
    const guildJoin = await getModuleSettings(member.guild, 'guildJoin');
    if (guildJoin.state === 1 && guildJoin.channel != null) {

        //fetch Audit & Hyper logs
        const HyperLogs = await FetchHyperLogs(member.guild, member);

        //construct message
        const logMessage = new MessageEmbed()
            .setTitle(`Member Joined :     ${member.user.tag}     (${HyperLogs.length})`)
            .setDescription(`<@${member.user.id}>  -  ${member.user.id}`)
            .addFields({ name: `Account created on`, value: `${new Date(member.user.createdAt).toUTCString()}`, inline: false })
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(embed.colour__blue)
            .setTimestamp()
            .setFooter({ text: `${member.user.id}` })

        //get target channel and send message embed
        const targetChannel = member.guild.channels.cache.get(guildJoin.channel);
        if (targetChannel) targetChannel.send({ embeds: [logMessage] }).catch((err) => { });

    }

    //get module settings, proceed if true
    const guildWelcome = await getModuleSettings(member.guild, 'guildWelcome');
    if (guildWelcome.state === 1 && guildWelcome.channel != null) {

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
        const targetChannel = member.guild.channels.cache.get(guildWelcome.channel);
        if (targetChannel) targetChannel.send({ embeds: [logMessage] }).catch((err) => { });

    }

    //setup timeout value and check is member is still timed out
    const timeOut = member.communicationDisabledUntilTimestamp != null ? new Date(member.communicationDisabledUntilTimestamp) : null
    if (timeOut - Date.now() > 0) {
        //check if there is a pending mute available
        const pendingMute = await checkPendingMute(member.guild.id, member.user.id);
        if (pendingMute == false) {
            //add jail role to member, if available
            if (member.guild.jailId != null) { //give jail role to member
                try { await member.roles.add(member.guild.jailId, `Re-added jail-role`).catch((err) => { }); }
                catch (error) { }
            }
        }
    }

    return;
}