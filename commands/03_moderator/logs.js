/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { page_buttons } = require('../../config/buttons');

//load required modules
const { MessageEmbed, InteractionCollector } = require("discord.js");
const { FetchHyperLogs, FilterTargetLogs } = require("../../utils/AuditManager");
const { ReplyErrorMessage } = require("../../utils/MessageManager");
const { getUserFromInput } = require("../../utils/Resolver");
const { chunk, time, convertSnowflake } = require('../../utils/functions');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);

    //get target user
    var target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) {
        //filter input from user
        let filter = new RegExp('<@!?([0-9]+)>', 'g').exec(arguments[0]);
        let item = filter != null ? filter[1] : arguments[0].trim();
        //return if input was not a snowflake
        if (convertSnowflake(item == false)) return ReplyErrorMessage(message, '@user was not found', 4800);
        //set target variables
        target = { key: null, id: item, user: { id: item, username: undefined } };
    }

    //get target logs from database
    const UserLogs = await FetchHyperLogs(message, target);

    //return error if no information was found
    if (target.key == null && UserLogs == false) return ReplyErrorMessage(message, '@user nor any logs were found', 4800);

    //filter all log information from both Audit and Hyper logs
    const FilterLogs = await FilterTargetLogs(target, UserLogs, [])

    //construct Embed message
    const messageEmbed = new MessageEmbed()
        .setTitle(`Userlogs (${UserLogs.length}) :     ${target.user.username}`)
        .setColor(embed.color)
        .setTimestamp()

    //fill embedded message
    switch (FilterLogs.status) {
        case 'kicked':
            messageEmbed
                .setTitle(`Userlogs (${UserLogs.length}) :     ${target.user.username}     -     ${FilterLogs.status}`)
            break;
        case 'banned':
            messageEmbed
                .setTitle(`Userlogs (${UserLogs.length}) :     ${target.user.username}     -     ${FilterLogs.status}`)
            break;
        case 'left':
            messageEmbed
                .setTitle(`Userlogs (${UserLogs.length}) :     ${target.user.username}     -     ${FilterLogs.status}`)
            break;
        default:
            messageEmbed
                .setTitle(`Userlogs (${UserLogs.length}) :     ${target.user.tag}`)
                .setThumbnail(target.user.avatarURL())
            break;
    }

    //setup description Array
    let descriptionArray = []

    //if no Userlogs are found
    if (UserLogs.length <= 0) {
        messageEmbed.setDescription(`\`\`\`User has no logs\`\`\``)
        messageEmbed.setFooter(`${target.user.id}`);

        //send messageEmbed
        return message.reply({ embeds: [messageEmbed] });
    }

    //if there are Userlogs
    if (UserLogs.length >= 1) {
        //go over each log and create an Array
        UserLogs.forEach(Userlog => {
            //modify timestamp
            var date_number = new Number(Userlog.date.create);
            var date_convert = new Date(date_number);

            //check if logtype is mute to alter description
            if (Userlog.type == 'mute') {
                descriptionArray.push(`[${Userlog.type}] - ${Userlog.id}\`\`\`yaml
Moderator:      ${Userlog.executor.username}                
Reason:         ${Userlog.reason}
Duration:       ${Userlog.duration} minutes
Date:           ${date_convert.toDateString()} - ${time(date_convert)} \`\`\` `);
            } else {
                descriptionArray.push(`[${Userlog.type}] - ${Userlog.id}\`\`\`yaml
Moderator:      ${Userlog.executor.username}                
Reason:         ${Userlog.reason}
Date:           ${date_convert.toDateString()} - ${time(date_convert)} \`\`\` `);
            }
        });

        //slice Userlogs in chunks of 5
        const descriptionPages = chunk(descriptionArray, 3);
        let page = 0, maxpages = descriptionPages.length - 1;

        //check if embed requires multiple pages
        if (descriptionPages.length > 1) {

            let paginator_message = await message.reply({
                embeds: [messageEmbed],
                components: [page_buttons]
            })

            //start collecting button presses for paginator
            let collector = new InteractionCollector(client, { message: paginator_message, time: 120000, componentType: "BUTTON" })

            //collect button interactions
            collector.on('collect', async (button) => {

                //filter members with no access
                // if (button.user.id != message.author.id) return button.reply({ ephemeral: true, embeds: [await ErrorMessage('Only the command executor can use the buttons')] })

                //update defer
                await button.deferUpdate();

                //add or retract page
                if (button.customId == 'plus') (page >= maxpages) ? maxpages : page++
                if (button.customId == 'minus') (page <= 0) ? 0 : page--

                //alter embedded message
                messageEmbed.setDescription(descriptionPages[page].join("\n"))
                messageEmbed.setFooter(`${target.user.id} | Page ${page + 1} of ${descriptionPages.length}`);

                //check page and alter buttons
                switch (page) {
                    case 0:
                        page_buttons.components[0].setDisabled(true)
                        page_buttons.components[1].setDisabled(false)
                        break;
                    case maxpages:
                        page_buttons.components[0].setDisabled(false)
                        page_buttons.components[1].setDisabled(true)
                        break;
                    default:
                        page_buttons.components[0].setDisabled(false)
                        page_buttons.components[1].setDisabled(false)
                }

                //edit paginator message
                paginator_message.edit({
                    embeds: [messageEmbed],
                    components: [page_buttons]
                });
            })

            //when button collection is over, disable buttons
            collector.on('end', collected => {
                //disable both buttons
                page_buttons.components[0].setDisabled(true)
                page_buttons.components[1].setDisabled(true)
                //edit paginator message
                paginator_message.edit({
                    embeds: [messageEmbed],
                    components: [page_buttons]
                });
            });

        } else {
            //alter embedded message
            messageEmbed.setDescription(descriptionPages[page].join("\n"))
            messageEmbed.setFooter(`${target.user.id}`);
            //send messageEmbed
            return message.reply({ embeds: [messageEmbed] });
        }
    }
}


//command information
module.exports.info = {
    name: 'logs',
    alias: [],
    category: 'moderation',
    desc: 'Get server infrigements from the target member',
    usage: '{prefix}logs @user',
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