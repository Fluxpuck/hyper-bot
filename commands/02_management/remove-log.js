/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { CROSS_button, CHECK_button } = require('../../assets/buttons');

//require modules
const { MessageEmbed, InteractionCollector, MessageActionRow } = require('discord.js');
const { getMemberLog, removeMemberLog } = require("../../database/QueryManager");
const { ReplyErrorMessage } = require("../../utils/MessageManager");


//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'logId was not provided', 4800);
    const logId = arguments[0];

    //check if log is available
    const memberLog = await getMemberLog(message.guild.id, logId);
    if (memberLog == false) return ReplyErrorMessage(message, 'No log with was found', 4800);

    //construct Embed message
    const messageEmbed = new MessageEmbed()
        .setTitle(`Remove Log :     ${logId}`)
        .setDescription(`Verify removing the log by clicking on the button below`)
        .setColor(embed.color)

    //construct verification buttons
    const verify_buttons = new MessageActionRow()
        .addComponents(CROSS_button, CHECK_button);
    //reset values
    verify_buttons.components[0].setDisabled(false);
    verify_buttons.components[1].setDisabled(false);

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

        //if verified
        if (button.customId === 'success') {

            //alter Embed message
            messageEmbed.setDescription(`Confirmed! Log has been removed`)
            messageEmbed.fields = []; //empty fields
            messageEmbed.setColor(embed.colour__green);
            messageEmbed.setTimestamp();

            //edit verify message
            verify_message.edit({
                embeds: [messageEmbed],
                components: []
            });

            //remove member log
            return removeMemberLog(message.guild.id, logId)

        } else {

            //alter Embed message
            messageEmbed.setDescription(`Stopped! Setup has been cancelled`)
            messageEmbed.fields = []; //empty fields
            messageEmbed.setColor(embed.colour__red);
            messageEmbed.setTimestamp();

            //edit verify message
            verify_message.edit({
                embeds: [messageEmbed],
                components: []
            });

        }

    })
    //when button collection is over, disable buttons
    collector.on('end', collected => {

        //disable both buttons
        verify_buttons.components[0].setDisabled(true)
        verify_buttons.components[1].setDisabled(true)

        //alter Embed message
        messageEmbed.setDescription(`Time is up! Log has not been removed.`)
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
    name: 'removelog',
    alias: ['remove_log'],
    category: 'management',
    desc: 'Remove a member log',
    usage: '{prefix}removelog logId',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'text',
        type: 'STRING',
        description: 'What should the bot say?',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}