/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling
const embed = require('../../assets/embed.json');

//load required modules
const { MessageEmbed } = require('discord.js');
const { capitalize } = require('../../utils/functions');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //setup the embedded message
    const helpMessage = new MessageEmbed()
        .setTitle('Hyper - General Help')
        .setThumbnail(embed.thumbnail)
        .setColor(embed.color)
        .setFooter(`${client.user.username} | hyperbot.cc`);

    //filter/sort all commands based on category
    const commandsByGroup = client.commands.reduce((key, value) => {
        // Group initialization
        if (!key[value.info.category]) {
            key[value.info.category] = [];
        }
        // Grouping
        key[value.info.category].push(value);
        return key;
    }, {});

    //if no arguments, send general Help message
    if (arguments.length < 1) {

        //general embed description
        helpMessage.setDescription(`${client.user.username} is a comprehensive server management bot, that allows for basic moderation, logging events, custom commands, timed messages, and more!\
        \ *Current server prefix is \`${prefix}\`*`)

        //got through all categories
        for (const category of Object.keys(commandsByGroup)) {
            if (category) {
                helpMessage.addFields(
                    {
                        name: `${capitalize(category)}`,
                        value: `
\`\`\`
${commandsByGroup[category].map(c => c.info.name).join('\n')}
\`\`\`
                    `,
                        inline: true
                    }
                )
            }
        }

        //send message
        message.channel.send({ embeds: [helpMessage] })

    }

    //if argument is command, give command help
    if (arguments.length > 0 && client.commands.has(arguments[0])) {
        const commandInfo = client.commands.get(arguments[0]).info

        //change embed variables
        helpMessage.setTitle(`Hyper - Command Help`)
        helpMessage.setFooter(`${capitalize(commandInfo.name)} | hyperbot.cc`)

        //command information
        helpMessage.addFields(
            {
                name: `Description`,
                value: `\`\`\`${commandInfo.desc}.\`\`\``,
                inline: false
            },
            {
                name: `Usage`,
                value: `\`\`\`${commandInfo.usage.replace('{prefix}', prefix)}\`\`\``,
                inline: true
            },
            {
                name: `Alias`,
                value: `\`\`\`${commandInfo.alias.length > 0 ? commandInfo.alias.join(', ') : "None"}\`\`\``,
                inline: true
            },
        )

        //send message
        message.channel.send({ embeds: [helpMessage] })

    }

}


//command information
module.exports.info = {
    name: 'help',
    alias: [],
    category: 'misc',
    desc: 'Get more information related to all the available commands',
    usage: '{prefix}help',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: []
}