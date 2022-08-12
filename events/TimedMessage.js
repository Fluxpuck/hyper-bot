/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//import styling from assets
const embedStyle = require('../assets/embed.json');

//load required modules
const { MessageEmbed } = require('discord.js');
const { separateFlags } = require('../utils/functions');
var cron = require('node-cron');

module.exports = async (client, guild, timedMessage) => {

    //go over all cron tasks and add them to the collection
    for await (let msg of timedMessage) {

        //setup cron name
        var cronName = `${guild.id}_${msg.name}`;
        //setup the cron task
        var task = cron.schedule(msg.crontime, async () => {

            //get guild and textchannel
            const targetChannel = guild.channels.cache.get(msg.channel);
            if (!targetChannel) return;

            //fetch previous messages and check content
            const LastMessages = await targetChannel.messages.fetch({ limit: 50, force: true });
            if (msg.lastMessage != null && LastMessages.has(msg.lastMessage)) return;

            //check if reponse needs embeds
            if (msg.embed === 1) {

                //construct Embed message
                const messageEmbed = new MessageEmbed()
                    .setColor(embedStyle.color)

                //seperate response
                const flags = ['title', 'author', 'url', 'thumb', 'desc', 'color', 'field', 'image', 'time', 'footer']
                const separatedResponse = await separateFlags(msg.response, { separator: '--', allowDuplicates: true }, flags)
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
                            messageEmbed.addFields({ name: fieldName, value: fieldDesc, inline: false })
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
                var lastMsg = await targetChannel.send({ embeds: [messageEmbed] })
                    .catch((err) => { });
                //set new last message
                msg.lastMessage = lastMsg.id;

            } else {

                //return message
                var lastMsg = await targetChannel.send(msg.response)
                    .catch((err) => { });
                //set new last message
                msg.lastMessage = lastMsg.id;
            }

        }, {
            scheduled: false
        });

        //enable the timed message
        if (msg.enabled === 1) task.start();

        //set the cron task in Collection
        await client.crons.set(cronName, task);
    }
    return;
}