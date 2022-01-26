/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { verify_buttons } = require('../../assets/buttons');

//require modules
const { MessageEmbed, InteractionCollector } = require('discord.js');
const { updateGuildPrefix } = require('../../database/QueryManager');
const { capitalize } = require('../../utils/functions');
const { ReplyErrorMessage } = require('../../utils/MessageManager');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'New prefix not provided', 4800);

    //if desired prefix is longer then 5 characters, return message
    if (arguments.length > 5) return ReplyErrorMessage(message, 'New prefix may not be longer then 5 characters', 4800);
    const newPrefix = arguments[0].toString();

    //construct Embed message
    const messageEmbed = new MessageEmbed()
        .setTitle(`Hyper Setup :     ${capitalize(module.exports.info.name)}`)
        .setDescription(`Verify the setup, as shown below, by clicking on the button.`)
        .addFields({ name: `Prefix`, value: `Desired prefix: \`${newPrefix}\``, inline: false })
        .setColor(embed.color)

    //return verification message to user
    let verify_message = await message.reply({
        embeds: [messageEmbed],
        components: [verify_buttons]
    })

    //start collecting button presses for paginator
    let collector = new InteractionCollector(client, { message: verify_message, time: 120000, componentType: "BUTTON" })

    //collect button interactions
    collector.on('collect', async (button) => {

        //filter members with no access
        if (button.user.id != message.author.id) return button.reply({ ephemeral: true, embeds: [await ErrorMessage('Only the command executor can use the buttons')] })

        //update defer
        await button.deferUpdate();

        //alter Embed message
        messageEmbed.setDescription(`Confirmed! Prefix has been updated to: \`${newPrefix}\``)
        messageEmbed.fields = []; //empty fields
        messageEmbed.setColor(embed.colour__green);
        messageEmbed.setTimestamp();

        //edit verify message
        verify_message.edit({
            embeds: [messageEmbed],
            components: []
        });

        //update guild prefix
        await updateGuildPrefix(message.guild.id, newPrefix);

    })
    //when button collection is over, disable buttons
    collector.on('end', collected => {

        //disable both buttons
        verify_buttons.components[0].setDisabled(true)
        verify_buttons.components[1].setDisabled(true)

        //alter Embed message
        messageEmbed.setDescription(`Time is up! Prefix has not been updated.`)
        messageEmbed.fields = []; //empty fields
        messageEmbed.setColor(embed.colour__red);

        //edit verify message
        verify_message.edit({
            embeds: [messageEmbed],
            components: [verify_buttons]
        });

    });
    return;
}


//command information
module.exports.info = {
    name: 'prefix',
    alias: ['set-prefix', 'change-prefix'],
    category: 'setup',
    desc: 'Change current prefix',
    usage: '{prefix}prefix',
}

//slash setup
module.exports.slash = {
    slash: true,
    options: [{
        name: 'prefix',
        type: 'STRING',
        description: 'Write desired prefix',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}