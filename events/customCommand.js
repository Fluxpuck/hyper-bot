/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//import styling from assets
const embedStyle = require('../assets/embed.json');

//require packages
const { MessageEmbed } = require("discord.js");
const { separateFlags } = require("../utils/functions");
const { getCustomCommand, checkCommandPermissions } = require("../utils/PermissionManager");
const messageCreate = require("./messageCreate");

module.exports = async (client, message, commandName) => {

    //get custom command
    const customCommand = await getCustomCommand(message.guild, commandName);
    if (!customCommand) return; //return if no custom command is found!

    //check command permissions from cache
    const verification = await checkCommandPermissions(message, commandName, customCommand);

    //execute commandfile if user has permission
    if (verification.status === true) {

        //delete message
        setTimeout(() => message.delete().catch((err) => { }), 100)

        //get command details
        var { customResponse, embed, cooldown } = customCommand

        //check, and set cooldown
        const cooldownKey = `${message.author.id}_${commandName}`
        //check if author has cooldown, else setup cooldown
        if (client.cooldowns.has(cooldownKey)) return;
        else client.cooldowns.set(cooldownKey, customCommand, cooldown);

        //check for supported Tags
        const supportedTags = ['{author}', '{mention}']
        for await (let tag of supportedTags) {
            //setup replacement
            var replacement = new RegExp(`${tag}`, 'g');
            var match = replacement.exec(customResponse);
            if (match) { //check if there is a match
                //check if {mention} is present and if the author mentioned an user
                if (match[0] == '{mention}'
                    && message.mentions.users.size < 1) return
                //replace tags from string
                if (match[0] == '{author}') customResponse = await customResponse.replace(replacement, `<@${message.author.id}>`)
                if (match[0] == '{mention}') customResponse = await customResponse.replace(replacement, `<@${message.mentions.users.first().id}>`)
            }
        }

        //check if embed is setup
        if (embed === 1) {

            //construct Embed message
            const messageEmbed = new MessageEmbed()
                .setColor(embedStyle.color)

            //seperate response
            const flags = ['title', 'author', 'url', 'desc', 'color', 'field', 'image', 'time', 'footer']
            const separatedResponse = await separateFlags(customResponse, { separator: '--', allowDuplicates: true }, flags)
            for await (let flag of separatedResponse) {
                switch (flag.name) {
                    case 'title':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup Title for embed
                        messageEmbed.setTitle(`${flag.args}`)
                        break;

                    case 'author':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup Author for embed
                        messageEmbed.setAuthor({ name: `${flag.args}` })
                        break;

                    case 'url':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup URL for embed
                        messageEmbed.setURL(`${flag.args}`)
                        break;

                    case 'desc':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup Description for embed
                        messageEmbed.setDescription(`${flag.args}`)
                        break;

                    case 'thumb':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup Thumbnail for embed
                        messageEmbed.setThumbnail(`${flag.args}`)
                        break;

                    case 'color':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //check if color is valid hex-color
                        let color = /^#[0-9A-F]{6}$/i.test(flag.args)
                        if (color == false) return;

                        //setup Color for embed
                        messageEmbed.setColor(`${flag.args}`)
                        break;

                    case 'field':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //check for multiple entries
                        if (!flag.args.includes("///")) return;
                        let currArgs = flag.args.split(`///`)
                        let fieldName = currArgs[0], fieldDesc = currArgs[1]
                        if (fieldName.length == 0 || fieldDesc.length == 0) return // Avoid errors

                        //setup multiple Fields for embed
                        messageEmbed.addField(fieldName, fieldDesc)
                        break;

                    case 'image':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup Image for embed
                        messageEmbed.setImage(`${flag.args}`)
                        break;

                    case 'time':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup Timestamp for embed
                        messageEmbed.setTimestamp()
                        break;

                    case 'footer':
                        //check if flag has valid args
                        if (flag.validArgs != true) return;

                        //setup Footer for embed
                        messageEmbed.setFooter({ text: `${flag.args}` })
                        break;
                }
            }

            //return message
            return message.channel.send({ embeds: [messageEmbed] })

        }
        //if it's not an embed, 
        else {

            //return message
            return message.channel.send(customResponse)

        }
    } // else message.reply(verification.message);
    return;
}