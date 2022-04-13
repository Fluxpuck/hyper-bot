/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//load required modules
const moment = require('moment');
const { getAway, removeAway } = require('../database/QueryManager');

module.exports = async (client, message) => {

    //setup values from message
    const { guild, member } = message
    const target = (message.mentions.members.size > 0 && message.mentions.members.size < 2) ? message.mentions.users.first() : member.user

    //get pending Away
    const pendingAway = await getAway(guild.id, target.id)
    if (pendingAway === false) return;

    //setup away time date
    const awaySince = moment(pendingAway.create_date).subtract(2, 'h');
    const backIn = moment(pendingAway.create_date).add(pendingAway.awayDuration, 'm');
    const awayFor = (awaySince.fromNow()).toString();

    //check if member is mentioned, else remove away
    if (message.mentions.members.size > 0 && message.mentions.members.size < 2) {
        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setAuthor({ name: `${target.tag} is away and will be back ${backIn.fromNow()}...`, iconURL: target.displayAvatarURL({ dynamic: false }) })
            .setColor(embed.color);

        //reply to message
        return message.reply({ embeds: [messageEmbed] })
            .then(msg => { setTimeout(() => msg.delete().catch((err) => { }), 4800) })
            .catch((err) => { });

    } else {

        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setAuthor({ name: `Welcome back ${target.username}`, iconURL: target.displayAvatarURL({ dynamic: false }) })
            .setDescription(`You've been away for ${(awayFor.replace('ago', ''))}`)
            .setColor(embed.color);

        //remove away from database
        await removeAway(guild.id, member.id);

        //reply to message
        return message.reply({ embeds: [messageEmbed] })
            .then(msg => { setTimeout(() => msg.delete().catch((err) => { }), 4800) })
            .catch((err) => { });

    }
}