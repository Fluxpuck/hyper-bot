/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { ReplyErrorMessage } = require("../../utils/MessageManager");
const { getUserFromInput } = require("../../utils/Resolver");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, '@user was not provided', 4800);

    //get target user
    const target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) return ReplyErrorMessage(message, '@user was not found', 4800);

    //disconnect the target
    const disconnect = await target.voice.kick().catch(err => {
        ReplyErrorMessage(message, `An Error occured, and ${target.user.tag} was not disconnected`);
        return false
    })

    //check if action was succesfull
    if (disconnect != false) {
        //verify that the user has been kicked
        message.reply(`**${target.user.tag}** has been disconnected from the voice-channel`);
        //save log to database and log event
        const hyperLog = await createHyperLog(message, 'disconnect', null, target, reason);

        //LOG "hyperLOG" to guild channel
    }
}


//command information
module.exports.info = {
    name: 'disconnect',
    alias: [],
    category: 'moderation',
    desc: 'Disconnect target member from a voicechannel',
    usage: '{prefix}disconnect @user',
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