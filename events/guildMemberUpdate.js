/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, oldMember, newMember) => {

    guildMemberUpdate = {
        "name": "timeout",
        "desc": "Send a log-message, when a member is muted",
        "state": "",
        "chnl": ""
    },
    {
        "name": "timeoutRevoke",
        "desc": "Send a log-message, when a member is unmuted",
        "state": "",
        "chnl": ""
    },
    {
        "name": "jail",
        "desc": "Send a member to jail, when a member is muted",
        "state": "",
        "chnl": ""
    }






    //check if member changed their nickname
    if (oldMember.nickname !== newMember.nickname) {
        //get module settings, proceed if true
        const changeNickname = await getModuleSettings(oldMember.guild, 'changeNickname');
        if (changeNickname.state === 1 && changeNickname.channel != null) {

            //setup nickname values, and if undefined usernames
            const oldNickname = oldMember.nickname != undefined ? oldMember.nickname : oldMember.user.username
            const newNickname = newMember.nickname != undefined ? newMember.nickname : newMember.user.username

            //construct message
            const logMessage = new MessageEmbed()
                .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`<@${oldMember.user.id}> changed from **${oldNickname}** to **${newNickname}**`)
                .setColor(embed.colour__yellow)
                .setTimestamp()
                .setFooter({ text: `${oldMember.user.id}` })

            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(changeNickname.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

        }
    }

    //check if member changed their avatar
    if (oldMember.avatar !== newMember.avatar) {
        //get module settings, proceed if true
        const changeAvatar = await getModuleSettings(oldMember.guild, 'changeAvatar');
        if (changeAvatar.state === 1 && changeAvatar.channel != null) {

            //construct message
            const logMessage = new MessageEmbed()
                .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`<@${oldMember.user.id}> changed their **avatar**`)
                .addFields({ name: `Avatar URL`, value: `${oldMember.user.displayAvatarURL()}`, inline: false })
                .setColor(embed.colour__yellow)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: false }))
                .setTimestamp()
                .setFooter({ text: `${oldMember.user.id}` })

            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(changeAvatar.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

        }
    }

    //setup TimeOut values
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp != null ? new Date(oldMember.communicationDisabledUntilTimestamp) : null
    const newTimeout = newMember.communicationDisabledUntilTimestamp != null ? new Date(newMember.communicationDisabledUntilTimestamp) : null

    //new TimeOut, if new timeout time is in the future
    if (newTimeout - Date.now() > 0) {

        //calculate timeout time, rounded to nearest 1000's
        const duration = ((newTimeout - Date.now()) / 1000).toFixed() * 1000


        //check if jail-role is available
        //fetch jail-role
        //give member jail-role


        //check if target is already in database
        //else check audit log add to database logs & pending









        //get module settings, proceed if true
        const timeout = await getModuleSettings(oldMember.guild, 'timeout');
        if (timeout.state === 1 && timeout.channel != null) {



            //create embed




            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(timeout.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

        }
    }

    //remove TimeOut, if an timeout has been removed
    if (oldTimeout != null && newTimeout == null) {

        console.log('Timeout has been removed')

        console.log(oldTimeout)
        console.log(newTimeout)


        //check if member has jail-role
        //remove jail-role


        //get module settings, proceed if true
        const timeoutRevoke = await getModuleSettings(oldMember.guild, 'timeoutRevoke');
        if (timeoutRevoke.state === 1 && timeoutRevoke.channel != null) {



            //create embed




            //get target channel and send message embed
            const targetChannel = oldMember.guild.channels.cache.get(timeoutRevoke.channel);
            if (targetChannel) return targetChannel.send({ embeds: [logMessage] });

        }

    }
    return;
}