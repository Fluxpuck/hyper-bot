/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { web_button } = require('../../config/buttons');

//load required modules
const { MessageEmbed } = require('discord.js');
const { msToTime } = require('../../utils/functions');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //setup the embedded message
    const infoEmbed = new MessageEmbed()
        .setTitle('Hyper - Information')
        .setDescription(`Use command \`${prefix}help\` for more information.`)
        .addFields(
            { name: `Guilds`, value: `\`\`\`${client.guilds.cache.size}\`\`\``, inline: true },
            { name: `Commands`, value: `\`\`\`${client.commands.size} commands\`\`\``, inline: true },
            { name: `Events`, value: `\`\`\`${client.events.size} events\`\`\``, inline: true },
            { name: `Uptime`, value: `\`\`\`${msToTime(process.uptime())}\`\`\``, inline: true },
            { name: `Version`, value: `\`\`\`${client.version}\`\`\``, inline: true },
        )
        .setThumbnail(embed.thumbnail)
        .setColor(embed.color)

    //reply to message with embed
    return message.reply({
        embeds: [infoEmbed],
        components: [web_button]
    })

}


//command information
module.exports.info = {
    name: 'bot',
    alias: ['info'],
    category: 'misc',
    desc: 'Get some information about client',
    usage: '{prefix}bot',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: []
}