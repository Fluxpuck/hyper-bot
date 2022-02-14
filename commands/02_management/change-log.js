/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { verify_buttons } = require('../../assets/buttons');

//require modules
const { MessageEmbed, InteractionCollector } = require('discord.js');
const { changeMemberLog, getMemberLog } = require("../../database/QueryManager");
const { ReplyErrorMessage } = require("../../utils/MessageManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'logId was not provided', 4800);
    const logId = arguments[0];

    //check if log is available
    const memberLog = await getMemberLog(message.guild.id, logId);
    if (memberLog == false) return ReplyErrorMessage(message, 'No log with was found', 4800);

    //check and set reason, else use default message
    let r = arguments.slice(1) //slice reason from arguments
    let reason = (r.length > 0) ? '' : false //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    //if there was no new reason provided
    if (reason == false) return ReplyErrorMessage(message, 'No new reason was provided', 4800);

    //construct Embed message
    const messageEmbed = new MessageEmbed()
        .setTitle(`Change Log :     ${logId}`)
        .setDescription(`Verify the log change by clicking on the button below`)
        .addFields(
            { name: `old Reason`, value: `\`${memberLog[0].logReason}\``, inline: false },
            { name: `new Reason`, value: `\`${reason.trim()}\``, inline: false },
        )
        .setColor(embed.color)

    //reset buttons into their default state
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
            messageEmbed.setDescription(`Confirmed! Log reason has been updated to: \`${reason}\``)
            messageEmbed.fields = []; //empty fields
            messageEmbed.setColor(embed.colour__green);
            messageEmbed.setTimestamp();

            //edit verify message
            verify_message.edit({
                embeds: [messageEmbed],
                components: []
            });

            //change member log
            return changeMemberLog(message.guild.id, logId, reason.trim())

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
        messageEmbed.setDescription(`Time is up! Log has not been updated.`)
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
    name: 'changelog',
    alias: ['change_log'],
    category: 'management',
    desc: 'Change a member log',
    usage: '{prefix}changelog logId',
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