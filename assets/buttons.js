
//construct packages
const { MessageButton, MessageActionRow } = require('discord.js');
//require configuration
const { applicationButton } = require('../config/config.json');

//previous button
const PREVIOUS_button = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel('< Previous')
    .setCustomId('minus')
    .setDisabled(true)

//next button
const NEXT_button = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel('Next >')
    .setCustomId('plus')
    .setDisabled(false)

//Next and Previous button ActionRow
const PaginatorButtons = new MessageActionRow()
    .addComponents(
        PREVIOUS_button,
        NEXT_button
    )

/*----------------------*/

//logs button
const LOGS_button = new MessageButton()
    .setStyle('SECONDARY')
    .setEmoji('🔍')
    .setLabel('Logs')
    .setCustomId('logs')
    .setDisabled(false)

//Logs button ActionRow
const LogsButtons = new MessageActionRow()
    .addComponents(
        LOGS_button
    )

/*----------------------*/

//website link button
const WEB_button = new MessageButton()
    .setStyle('LINK')
    .setURL('https://hyperbot.cc/')
    .setEmoji('🌐')
    .setLabel('Website')
    .setDisabled(false)

//Website button ActionRow
const WebButtons = new MessageActionRow()
    .addComponents(
        WEB_button
    )

/*----------------------*/

//cross button
const CROSS_button = new MessageButton()
    .setStyle('DANGER')
    .setLabel('X')
    .setCustomId('fault')
    .setDisabled(false)

//check button
const CHECK_button = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('✓')
    .setCustomId('success')
    .setDisabled(false)

//Verify button ActionRow
const VerifyButtons = new MessageActionRow()
    .addComponents(
        CROSS_button,
        CHECK_button
    )

/*----------------------*/

//Application button
const apply_button = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('Apply!')
    .setCustomId('application')
    .setDisabled(false)

//Collect Application button ActionRow
const ApplyButtons = new MessageActionRow()
    .addComponents(apply_button)

/*----------------------*/


//export buttons & actionrows
exports.page_buttons = PaginatorButtons;
exports.log_button = LogsButtons;
exports.web_button = WebButtons;
exports.verify_buttons = VerifyButtons;
exports.apply_button = ApplyButtons;