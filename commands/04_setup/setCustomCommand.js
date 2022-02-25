/*  TheFallenShade © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { CROSS_button, CHECK_button } = require('../../assets/buttons');

//require modules
const { MessageEmbed } = require('discord.js');
const { capitalize } = require('../../utils/functions');
const { ReplyErrorMessage } = require('../../utils/MessageManager');
const { getRoleFromInput, getChannelfromInput } = require('../../utils/Resolver')

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //custom getMessages function
    const getMessages = (numOfMessages, timeToWait, message, customFilter = 0) => {
        //check if custom_filter is set, else filter by message author
        let filter = (customFilter != 0) ? customFilter : m => m.author.id == message.author.id // Improved filtering.
        let retValue = 0; //create empty return value
        // Collect the messages
        await message.channel.awaitMessages(filter, { max: numOfMessages, time: timeToWait, errors: ['time'] })
            .then(collectedMessages => { //fill return value
                retValue = Array.from(collectedMessages.values())
            }).catch(err => { throw err }) //throw error
        return retValue
    }

    //construct Embed message
    const setupEmbed = new MessageEmbed()
    .setTitle(`Hyper Setup :     ${capitalize(module.exports.info.name)}`)
    .setDescription(`Please type the desired **custom command name**`)
    .setColor(embed.color)

    let setupMessage = await message.reply({
        embeds: [setupEmbed]
    })

    // Custom command variables
    let commandName = ""
    let commandDesc = ""
    let embedOption = false
    let cooldown = 0
    let rolePerms = ""
    let channelPerms = ""

    // Get command name
    let userInput = await getMessages(1, 60000, message).catch(e => {})
    if (userInput != 0) commandName = userInput[0].split(" ").join("").toLowerCase()
    else return ReplyErrorMessage(setupMessage, "No response given, canceling setup.")

    // ------------------------------------------------------------------------------------------------------

    // Edit embed and message
    setupEmbed.setDescription(`Please type the desired **custom command description**`)
    setupEmbed.addFields({
        name: 'Name', value: `${commandName}`, inline: false
    })
    setupMessage.edit({
        embeds: [setupEmbed]
    })

    // Get command desc
    userInput = await getMessages(1, 60000, message).catch(e => {})
    if (userInput != 0) commandDesc = userInput[0]
    else return ReplyErrorMessage(setupMessage, "No response given, canceling setup.")

    // ------------------------------------------------------------------------------------------------------

    // Edit embed and message
    setupEmbed.setDescription(`Should the custom command be sent in an embed?\nPlease answer with yes or no`)
    setupEmbed.addFields({
        name: 'Description', value: `${commandDesc}`, inline: false
    })
    setupMessage.edit({
        embeds: [setupEmbed]
    })

    // Get embed option
    userInput = await getMessages(1, 60000, message).catch(e => {})
    if (userInput != 0) embedOption = userInput[0].split(" ").join("").toLowerCase()
    else return ReplyErrorMessage(setupMessage, "No response given, canceling setup.")
    
    // Test for yes / no
    if (embedOption != "yes" && embedOption != 'no') return ReplyErrorMessage(setupMessage,"Received invalid input, expected **yes** or **no**")

    // ------------------------------------------------------------------------------------------------------

    // Edit embed and message
    setupEmbed.setDescription(`What should be the cooldown (in seconds) of the custom command?\nPlease answer with a number`)
    setupEmbed.addFields({
        name: 'Sent in embed', value: `${embedOption}`, inline: false
    })
    setupMessage.edit({
        embeds: [setupEmbed]
    })

    // Get embed option
    userInput = await getMessages(1, 60000, message).catch(e => {})
    if (userInput != 0) cooldown = userInput[0].split(" ").join("").toLowerCase()
    else return ReplyErrorMessage(setupMessage, "No response given, canceling setup.")

    // Test for number
    if (!isNaN(cooldown)) return ReplyErrorMessage(setupMessage, "Received invalid input, expected **a number**")

    // ------------------------------------------------------------------------------------------------------

    // Edit embed and message
    setupEmbed.setDescription(`Which roles should be able to use the custom command?\n
    Please type all the role ids / tag the roles that should be able to use this custom command separated by commas\n
    Example: @role/roleID, @role/roleID...`)
    setupEmbed.addFields({
        name: 'Cooldown', value: `${cooldown}`, inline: false
    })
    setupMessage.edit({
        embeds: [setupEmbed]
    })

    // Get embed option
    userInput = await getMessages(1, 60000, message).catch(e => {})
    if (userInput != 0) rolePerms = userInput[0].split(" ").join("").toLowerCase()
    else return ReplyErrorMessage(setupMessage, "No response given, canceling setup.")

    // Check for valid roles
    let inputRoles = rolePerms.split(",")
    let roleIdArr = []
    inputRoles.forEach(roleStr => {
        // Check if we got an invalid role mention / id
        let guildRole = getRoleFromInput(message.guild, roleStr)
        if (guildRole == false) return ReplyErrorMessage(setupMessage, "Received invalud input or couldn't find all roles, expected **role mentions or role IDs separated by commas**")
        roleIdArr.push(`${guildRole.id}`)
    })
    rolePerms = roleIdArr.join(",")

    // ------------------------------------------------------------------------------------------------------

    // Make a nice string of role mentions for embed
    let rolesStr = ""
    let rolesStrArr = []
    roleIdArr.forEach(roleId => {
        rolesStrArr.push(`<@&${roleId}>`)
    })
    rolesStr = rolesStrArr.join(", ")

    // Edit embed and message
    setupEmbed.setDescription(`Which channels should the custom command be usable in?\n
    Please type all the channel ids / tag the channels that the command should be usable in separated by commas\n
    Example: #channel/channelID, #channel/channelID...`)
    setupEmbed.addFields({
        name: 'Roles', value: `${rolesStr}`, inline: false
    })
    setupMessage.edit({
        embeds: [setupEmbed]
    })

    // Get embed option
    userInput = await getMessages(1, 60000, message).catch(e => {})
    if (userInput != 0) channelPerms = userInput[0].split(" ").join("").toLowerCase()
    else return ReplyErrorMessage(setupMessage, "No response given, canceling setup.")

    // Check for valid channels
    let inputChannels = channelPerms.split(",")
    let channelIdArr = []
    inputChannels.forEach(channelStr => {
        // Check if we got an invalid channel mention / id
        let guildChannel = getChannelfromInput(message.guild, channelStr)
        if (guildChannel== false) return ReplyErrorMessage(setupMessage, "Received invalid input or couldn't find all channels, expected **channel mentions or channel IDs separated by commas**")
        channelIdArr.push(`${guildChannel.id}`)
    })
    channelPerms = channelIdArr.join(",")

    // ------------------------------------------------------------------------------------------------------

    // Make a nice string of channel mentions for embed
    let channelsStr = ""
    let channelsStrArr = []
    channelIdArr.forEach(channelId => {
        channelsStrArr.push(`<@&${channelId}>`)
    })
    channelsStr = channelsStrArr.join(", ")

    // Edit embed and message and add buttons
    setupEmbed.setDescription(`Setup information complete!\n
    Please click the check button to confirm or the cross button to cancel.`)
    setupEmbed.addFields({
        name: 'Channels', value: `${channelsStr}`, inline: false
    })

    const confirmationButtons = new MessageActionRow()
    .addComponents(CROSS_button, CHECK_button);

    confirmationButtons.components[0].setDisabled(false);
    confirmationButtons.components[1].setDisabled(false);

    setupMessage.edit({
        embeds: [setupEmbed],
        components: [confirmationButtons]
    })
    
    //start collecting button presses for paginator
    let collector = new InteractionCollector(client, { message: setupMessage, time: 120000, componentType: "BUTTON" })
    collector.on('collect', async (button) => {
        
        // Filter who can use the button
        if (button.user.id != message.author.id) return button.reply({ ephemeral: true, embeds: [await ErrorMessage('Only the command executor can use the buttons')] })

        // Defer Update
        await button.deferUpdate();

        // Process
        if (button.customId == 'success') {

            let createDate = new Date(Date.now()).toUTCString()
            let updateDate = createDate

            // TODO:
            // Check if a custom command already exists with the name only
            // If exists -> return and cancel setup

            // Cancel Setup
            setupEmbed.setDescription(`A new custom command has been created with this information:`)
            setupEmbed.setColor(embed.colour__green);
            setupEmbed.setTimestamp();

            //edit verify message
            setupMessage.edit({
                embeds: [setupEmbed],
                components: []
            });

            // TODO:
            // PUSH TO SQL WITH ALL INFORMATION

        } else {
            // Cancel Setup
            setupEmbed.setDescription(`Custom Command Setup has been canceled!`)
            setupEmbed.fields = []; //empty fields
            setupEmbed.setColor(embed.colour__red);
            setupEmbed.setTimestamp();

            //edit verify message
            setupMessage.edit({
                embeds: [setupEmbed],
                components: []
            });
        }
    })

    collector.on('end', collected => {
        // Disable buttons
        confirmationButtons.components[0].setDisabled(true);
        confirmationButtons.components[1].setDisabled(true);

        // Edit verify message with disabled buttons
        setupMessage.edit({
            embeds: [setupEmbed],
            components: [confirmationButtons]
        });
    })

    return
}


//command information
module.exports.info = {
    name: 'custom-command',
    alias: [],
    category: 'setup',
    desc: 'Setup a custom command through an interactive setup',
    usage: '{prefix}custom-command',
}

//slash setup
// module.exports.slash = {
//     slash: false,
//     options: [],
//     permission: [],
//     defaultPermission: false,
//     ephemeral: true
// }