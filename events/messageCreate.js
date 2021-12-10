/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//require packages
const { getGuildPrefix } = require("../utils/PermissionManager");
// const CommandManager = require('../utils/CommandManager');

//exports "message" event
module.exports = async (client, message) => {

    //ignore private messages and messages from other bots
    if (message.channel.type === 'dm') return
    if (message.author.bot) return

    //get prefix  
    const prefix = await getGuildPrefix(message.guild);

    /** Message Handler
     * filter message content into workable elements */
    const messageArray = message.content.split(' ')
    const messagePrefix = messageArray[0]
    const messageCommand = messagePrefix.replace(prefix, '').trim()
    const messageArgs = messageArray.slice(1)

    //check if content starts with prefix, else return
    if (messagePrefix.startsWith(prefix)) {

        //check for regular command (including alliasses)
        const commandFile = (client.commands.get(messageCommand)) ?
            client.commands.get(messageCommand) :
            client.commands.find(cmd => cmd.info.alias.includes(messageCommand));

        //if a commandFile has been found, check permissions and execute
        if (commandFile) {

            //get command permissions from cache
            //check command permissions, else return

            //execute commandfile
            commandFile.run(client, message, messageArgs, prefix, 'permissions');
        }

    }

    //if client is mentioned, but no content is given return info
    if (message.content.startsWith('<@') && message.content.endsWith('>')) {
        if (message.mentions.users.first().id === client.user.id && messageArgs.length < 1) {
            message.reply(`Hello, your current server prefix is \`${prefix}\``)
                .then(msg => { setTimeout(() => msg.delete(), 5000) })
        }
    }

}