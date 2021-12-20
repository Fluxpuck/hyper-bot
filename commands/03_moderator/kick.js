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

    //check if target is moderator
    if (target.permissions.has('KICK_MEMBERS')) return ReplyErrorMessage(message, '@user is a moderator', 4800);

    //check and set reason, else use default message
    let r = arguments.slice(1) //slice reason from arguments
    let reason = (r.length > 0) ? '' : 'No reason was provided.' //set default message if no reason was provided
    r.forEach(word => { reason += `${word} ` }); //set the reason

    //kick the target
    await target.kick({ reason: `{HYPER} ` }).catch(err => {
        return ReplyErrorMessage(message, `An Error occured, and ${target.user.tag} was not kicked`);
    });

    //verify that the user has been kicked
    message.reply(`**${target.user.tag}** has been kicked from the server`);

    //SAVE TO DATABASE &
    //LOG THE EVENT

}


//command information
module.exports.info = {
    name: 'kick',
    alias: [],
    category: 'moderation',
    desc: 'Kick target member from the server',
    usage: '{prefix}kick @user [reason]',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: []
}