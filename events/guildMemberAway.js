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
    const target = (!message.mentions.users.first()) ? member.user : message.mentions.users.first()

    //check if member is being mentioned
    if (message.mentions.members.size > 0) {

        //get pending Away
        const pendingAway = await getAway(guild.id, target.id)
        if (pendingAway === false) {

            //get pending Away
            const pendingAway = await getAway(guild.id, member.id)
            if (pendingAway === false) return;

            //setup away time date
            const awaySince = moment(pendingAway.create_date).subtract(2, 'h');
            const awayFor = (awaySince.fromNow()).toString();

            //setup embed message
            const messageEmbed = new MessageEmbed()
                .setAuthor({ name: `Welcome back ${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: false }) })
                .setDescription(`You've been away for ${(awayFor.replace('ago', ''))}`)
                .setColor(embed.color);

            //remove away from database
            await removeAway(guild.id, member.id);

            //reply to message
            return message.reply({ embeds: [messageEmbed] })
                .then(msg => { setTimeout(() => msg.delete().catch((err) => { }), 4800) })
                .catch((err) => { });

        } else {
            //setup away time date
            const backIn = moment(pendingAway.create_date).add(pendingAway.awayDuration, 'm');

            //setup embed message
            const messageEmbed = new MessageEmbed()
                .setAuthor({ name: `${target.tag} is away and will be back ${backIn.fromNow()}...`, iconURL: target.displayAvatarURL({ dynamic: false }) })
                .setColor(embed.color);

            //reply to message
            return message.reply({ embeds: [messageEmbed] })
                .then(msg => { setTimeout(() => msg.delete().catch((err) => { }), 4800) })
                .catch((err) => { });
        }
    } else {

        //get pending Away
        const pendingAway = await getAway(guild.id, member.id)
        if (pendingAway === false) return;

        //setup away time date
        const awaySince = moment(pendingAway.create_date).subtract(2, 'h');
        const awayFor = (awaySince.fromNow()).toString();

        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setAuthor({ name: `Welcome back ${member.user.username}`, iconURL: member.user.displayAvatarURL({ dynamic: false }) })
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