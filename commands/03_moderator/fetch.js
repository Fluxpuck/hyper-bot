/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { log_button } = require('../../assets/buttons');

//load required modules
const { MessageEmbed, InteractionCollector } = require("discord.js");
const { FetchHyperLogs, FetchBanLog, FilterTargetLogs } = require("../../utils/AuditManager");
const { convertSnowflake, capitalize } = require("../../utils/functions");
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getUserFromInput } = require("../../utils/Resolver");
const { getModuleSettings } = require('../../utils/PermissionManager');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);

    //get target user
    let target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) {
        //filter input from user
        let filter = new RegExp('<@!?([0-9]+)>', 'g').exec(arguments[0]);
        let item = filter != null ? filter[1] : arguments[0].trim();
        //return if input was not a snowflake
        if (convertSnowflake(item) === false) return ReplyErrorMessage(message, '@user was not found', 4800);
        //set target letiables
        target = { key: null, id: item, user: { id: item, username: undefined } };
    }

    //fetch Audit & Hyper logs
    const HyperLogs = await FetchHyperLogs(message, target);
    const BanLogs = await FetchBanLog(message, target);

    //return error if no information was found
    if (target.key === null && HyperLogs === false && BanLogs === false) return ReplyErrorMessage(message, '@user nor any logs were found', 4800);

    //filter all log information from both Audit and Hyper logs
    const FilterLogs = await FilterTargetLogs(target, HyperLogs, BanLogs)

    //modify timestamp
    let date_number = new Number(FilterLogs.date);
    let date_convert = new Date(date_number);

    //construct Embed message
    const messageEmbed = new MessageEmbed()
        .setTitle(`Member information :     ${target.user.username}     (${HyperLogs.length})`)
        .setDescription(`<@${target.user.id}>  -  ${target.user.id}`)
        .setColor(embed.color)
        .setTimestamp()
        .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: false }) })

    //fill embedded message
    switch (FilterLogs.status) {
        case 'kicked':
            messageEmbed
                .addFields(
                    { name: `${capitalize(FilterLogs.status)}`, value: `\`\`\`${FilterLogs.reason}\`\`\``, inline: false },
                    { name: 'Left server', value: `\`\`\`${date_convert.toDateString()}\`\`\``, inline: false },
                )
            break;
        case 'banned':
            messageEmbed
                .addFields(
                    { name: `${capitalize(FilterLogs.status)}`, value: `\`\`\`${FilterLogs.reason}\`\`\``, inline: false },
                    { name: 'Left server', value: `\`\`\`${date_convert.toDateString()}\`\`\``, inline: false },
                )
            break;
        case 'left':
            messageEmbed
                .addFields(
                    { name: `${capitalize(FilterLogs.status)}`, value: `\`\`\`Has left the server\`\`\``, inline: false },
                )
            break;
        default:
            messageEmbed
                .setTitle(`Member information :     ${target.user.tag}     (${HyperLogs.length})`)
                .setThumbnail(target.user.avatarURL())
                .addFields(
                    { name: 'Avatar', value: target.user.displayAvatarURL(), inline: false },
                    { name: 'Registered', value: `\`\`\`${new Date(target.user.createdAt).toUTCString()}\`\`\``, inline: true },
                    { name: 'Joined server', value: `\`\`\`${new Date(target.joinedTimestamp).toUTCString()}\`\`\``, inline: true },
                )
            break;
    }

    //check if user has logs and add log button if needed
    let fetch_message;
    if (HyperLogs.length >= 1) {
        //setup logbutton label with amount of Userlogs
        log_button.components[0].setLabel(`Show ${HyperLogs.length} logs`);
        log_button.components[0].setDisabled(false);
        //send messageEmbed
        fetch_message = await message.reply({
            embeds: [messageEmbed],
            components: [log_button]
        })

        //start collecting button presses for paginator
        let collector = new InteractionCollector(client, { message: fetch_message, time: 60000, componentType: "BUTTON" })

        //collect button interactions
        collector.on('collect', async (button) => {

            //filter members with no access
            if (button.user.id != message.author.id) return button.reply({ ephemeral: true, embeds: [await ErrorMessage('Only the command executor can use the buttons')] })

            //update defer
            await button.deferUpdate();

            //run LOGS.js command file
            let commandfile = client.commands.get("logs");
            if (commandfile) commandfile.run(client, message, [target.user.id], prefix, permissions);

            //disable button after command has run
            log_button.components[0].setDisabled(true);

            //edit paginator message
            fetch_message.edit({
                embeds: [messageEmbed],
                components: [log_button]
            });

        })

        //when button collection is over, disable buttons
        collector.on('end', collected => {
            //disable both buttons
            log_button.components[0].setDisabled(true)
            //edit paginator message
            fetch_message.edit({
                embeds: [messageEmbed],
                components: [log_button]
            });
        });

    } else {
        //send messageEmbed
        return message.reply({ embeds: [messageEmbed] })
    }

    //get module settings, proceed if true
    const moderationAction = await getModuleSettings(message.guild, 'moderationAction');
    if (moderationAction.state === 1 && moderationAction.channel != null) {
        //don't log in channels that are excepted from logging
        if (moderationAction.exceptions.includes(message.channel.id)) return;
        return SendModerationActionMessage(message, module.exports.info.name, moderationAction.channel)
    }
    return;
}


//command information
module.exports.info = {
    name: 'fetch',
    alias: ['whois'],
    category: 'moderation',
    desc: 'Get user-information from the target member',
    usage: '{prefix}fetch @user',
}

//slash setup
module.exports.slash = {
    slash: true,
    options: [{
        name: 'user',
        type: 'USER',
        description: 'Mention target user',
        required: true,
    }]
}