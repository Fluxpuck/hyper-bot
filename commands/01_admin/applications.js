/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling
const { APPLY_button } = require('../../assets/buttons');

//require modules
const { MessageEmbed, MessageActionRow } = require("discord.js");
const { ReplyErrorMessage } = require("../../utils/MessageManager");
const { textchannels } = require('../../config/config.json');
const { updateApplication } = require('../../database/QueryManager');
const { loadGuildConfiguration } = require('../../utils/PermissionManager');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no channel was provided
    if (arguments.length < 1) return ReplyErrorMessage(oldMessage, 'Where should I post?', 4800);

    //get target channel
    const channel = message.guild.channels.cache.find(c => c.id == arguments[0].replace(/[^\w\s]/gi, ''))
    if (!channel) return ReplyErrorMessage(message, `#channel was not found`, 4800)
    if (textchannels.includes(channel.type) == false) return ReplyErrorMessage(message, `#channel is not a text channel`, 4800)

    //create embedded message
    const collect_message = new MessageEmbed()
        .setDescription(`Please click the button to start your application process.`)

    //construct apply button
    const apply_button = new MessageActionRow()
        .addComponents(APPLY_button);

    //send message to target channel
    await channel.send({
        embeds: [collect_message],
        components: [apply_button],
    })

    //update database & permissions
    await updateApplication(message.guild.id, channel.id)
    await loadGuildConfiguration(message.guild)
    return;
}


//command information
module.exports.info = {
    name: 'applications',
    alias: ['apply'],
    category: 'admin',
    desc: 'Creates an application module',
    usage: '{prefix}applications [channel]',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}