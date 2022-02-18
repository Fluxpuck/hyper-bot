//construct packages
const { MessageButton } = require('discord.js');
/*----------------------*/

//export previous button
exports.PREVIOUS_button = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel('< Previous')
    .setCustomId('minus')
    .setDisabled(true)

//export next button
exports.NEXT_button = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel('Next >')
    .setCustomId('plus')
    .setDisabled(false)

/*----------------------*/

//logs button
exports.LOGS_button = new MessageButton()
    .setStyle('SECONDARY')
    .setEmoji('🔍')
    .setLabel('Logs')
    .setCustomId('logs')
    .setDisabled(false)

/*----------------------*/

//website link button
exports.WEB_button = new MessageButton()
    .setStyle('LINK')
    .setURL('https://hyperbot.cc/')
    .setEmoji('🌐')
    .setLabel('Website')
    .setDisabled(false)

/*----------------------*/

//cross button
exports.CROSS_button = new MessageButton()
    .setStyle('DANGER')
    .setLabel('X')
    .setCustomId('fault')
    .setDisabled(false)

//check button
exports.CHECK_button = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('✓')
    .setCustomId('success')
    .setDisabled(false)

/*----------------------*/

//Application button
exports.APPLY_button = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('Apply!')
    .setCustomId('application')
    .setDisabled(false)

/*----------------------*/