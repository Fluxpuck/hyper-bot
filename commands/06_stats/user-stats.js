/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//import styling from assets
const embed = require('../../assets/embed.json');
const { PREVIOUS_button, NEXT_button } = require('../../assets/buttons');

//load required modules
const moment = require('moment');
const { MessageEmbed, MessageActionRow, InteractionCollector } = require('discord.js');
const { getDailyUserStatistics } = require("../../database/QueryManager2");
const { ReplyErrorMessage } = require("../../utils/MessageManager");
const { getUserFromInput } = require("../../utils/Resolver");
const { chunk } = require('../../utils/functions');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(oldMessage, '@user was not provided', 4800);

    //try and get user from input
    const member = await getUserFromInput(message.guild, arguments[0]);
    if (!member) return ReplyErrorMessage(message, '@user was not found', 4800);

    //fetch user statistics from database
    const results = await getDailyUserStatistics(message.guild.id, member.id);
    if (results.length <= 0) return ReplyErrorMessage(message, `No statistics for ${member.user.tag} were found`, 4800);

    //construct Embed message
    const messageEmbed = new MessageEmbed()
        .setTitle(`Userstats :     ${member.user.tag}`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: false }))
        .setColor(embed.color)
        .setTimestamp()

    //setup description Array
    let descriptionArray = []

    //if there are Userlogs
    let paginator_message;
    if (results.length >= 1) {

        //go over each result and add to MessageEmbed
        for await (let result of results) {
            descriptionArray.push(`${moment(result.create_date).format("dddd, MMMM Do YYYY")}\`\`\`yaml
Messages:      ${result.total_messages} ${result.total_messages === '1' ? 'message' : 'messages'}             
Activity:      ${result.uniq_messages} ${result.uniq_messages === '1' ? 'minute' : 'minutes'}\`\`\` `);
        }

        //slice Userlogs in chunks of 3
        const descriptionPages = chunk(descriptionArray, 5);
        let page = 0, maxpages = descriptionPages.length - 1;

        //setup embedded message
        messageEmbed.setDescription(descriptionPages[page].join("\n"))
        messageEmbed.setFooter({ text: `${member.user.id} | Page ${page + 1} of ${descriptionPages.length}` });

        //construct page buttons
        const page_buttons = new MessageActionRow()
            .addComponents(PREVIOUS_button, NEXT_button);
        //reset values
        page_buttons.components[0].setDisabled(true);
        page_buttons.components[1].setDisabled(false);

        //check if embed requires multiple pages
        if (descriptionPages.length > 1) {
            //send messageEmbed
            paginator_message = await message.reply({
                embeds: [messageEmbed],
                components: [page_buttons]
            }).catch((err) => { });

            //start collecting button presses for paginator
            let collector = await new InteractionCollector(client, { message: paginator_message, time: 60000, componentType: "BUTTON" })

            //collect button interactions
            collector.on('collect', async (button) => {

                //filter members with no access
                if (button.user.id != message.author.id) return button.reply({ ephemeral: true, embeds: [await ErrorMessage('Only the command executor can use the buttons')] })

                //update defer
                await button.deferUpdate();

                //add or retract page
                if (button.customId == 'plus') (page >= maxpages) ? maxpages : page++
                if (button.customId == 'minus') (page <= 0) ? 0 : page--

                //alter embedded message
                messageEmbed.setDescription(descriptionPages[page].join("\n"))
                messageEmbed.setFooter({ text: `${member.user.id} | Page ${page + 1} of ${descriptionPages.length}` });

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
            messageEmbed.setFooter({ text: `${member.user.id}` });
            //send messageEmbed
            return message.reply({ embeds: [messageEmbed] })
                .catch((err) => { });
        }
    }
    return;
}


//command information
module.exports.info = {
    name: 'user-stats',
    alias: [''],
    category: 'stats',
    desc: 'Check the activity stats of a specific user',
    usage: '{prefix}user-stats roleId',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}