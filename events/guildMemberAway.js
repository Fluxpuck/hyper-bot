/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

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
    const awaySince = moment(pendingAway.create_date)
    const backIn = moment(pendingAway.create_date).add(pendingAway.awayDuration, 'm')

    //check if member is mentioned, else remove away
    if (message.mentions.members.size > 0 && message.mentions.members.size < 2) {
        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setAuthor({ name: `${target.tag} is away and will be back ${backIn.fromNow()}...`, iconURL: target.displayAvatarURL({ dynamic: false }) })
            .setColor(embed.color);

        //return message to user
        return message.reply({ embeds: [messageEmbed] })
            .then(msg => { setTimeout(() => msg.delete(), 3800) }); //delete message after

    } else {
        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setAuthor({ name: `Welcome back ${target.username}`, iconURL: target.displayAvatarURL({ dynamic: false }) })
            .setDescription(`You've been away from ${(((awaySince.fromNow()).toString()).replace('from', 'for').replace('ago', ''))}`)
            .setColor(embed.color);

        //remove away from database
        await removeAway(guild.id, member.id);

        //return message to user
        return message.reply({ embeds: [messageEmbed] })
            .then(msg => { setTimeout(() => msg.delete(), 3800) }); //delete message after
    }
}