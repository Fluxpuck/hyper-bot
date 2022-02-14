/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//require modules
const { saveAway } = require("../../database/QueryManager");
const { ReplyErrorMessage } = require("../../utils/MessageManager");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //delete command message
    setTimeout(() => message.delete(), 100);

    //if there are no arguments, no duration has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'No away duration was provided', 4800);

    //setup away duration
    const awayDuration = parseInt(arguments[0]);
    if (isNaN(awayDuration)) return ReplyErrorMessage(message, 'Duration was not a number', 4800);

    //if away duration is a number, continue
    if (!isNaN(awayDuration)) {

        //if time is not between 5 minutes and 12 hours, return message
        if (awayDuration <= 5 || awayDuration >= 720) return ReplyErrorMessage(message, 'Duration must be between 5 minutes and 12 hours', 4800);

        //save or update away feature
        await saveAway(message.guild.id, message.author.id, awayDuration);

        //return message to the user
        return message.channel.send(`**${message.author.tag}** is away for **${awayDuration}** minutes`)
            .then(msg => { setTimeout(() => msg.delete(), 2800) }); //delete message after

    }
    return;
}

//command information
module.exports.info = {
    name: 'away',
    alias: ['brb', 'afk'],
    category: 'misc',
    desc: 'Set an AFK (away from keyboard) timer',
    usage: '{prefix}away [minutes]',
}
//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'amount',
        type: 'NUMBER',
        description: 'Amount of messages',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
}