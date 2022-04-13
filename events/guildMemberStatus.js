/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//load required modules
const moment = require('moment');
const { getStatus } = require('../database/QueryManager');
const { clean } = require('../utils/functions');

module.exports = async (client, message) => {

    //setup values from message
    const { guild, member } = message
    const target = (message.mentions.members.size > 0 && message.mentions.members.size < 2) ? message.mentions.users.first() : member.user

    //get pending Away
    const pendingStatus = await getStatus(guild.id, target.id)
    if (pendingStatus === false) return;

    //setup away time date
    const awaySince = moment(pendingStatus.create_date).subtract(2, 'h');
    const awayFor = (awaySince.fromNow()).toString();

    //check if member is mentioned, else remove away
    if (message.mentions.members.size > 0 && message.mentions.members.size < 2) {

        //get mentioned user
        const mention = message.mentions.users.first();

        //check, and set cooldown
        const cooldownKey = `${mention.id}_status`
        //check if author has cooldown, else setup cooldown
        if (client.cooldowns.has(cooldownKey)) return;
        else client.cooldowns.set(cooldownKey, pendingStatus, 60); //60 seconds cooldown

        //setup embed message
        const messageEmbed = new MessageEmbed()
            .setAuthor({ name: `${target.tag}:   ${awayFor}`, iconURL: target.displayAvatarURL({ dynamic: false }) })
            .setDescription(`${clean(client, pendingStatus.status)}`)
            .setColor(embed.color);

        //return message to user
        return message.reply({ embeds: [messageEmbed] })
            .then(msg => { setTimeout(() => msg.delete().catch((err) => { }), 4800) })
            .catch((err) => { });
    }
    return;
}