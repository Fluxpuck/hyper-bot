/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//load required modules
const { ReplyErrorMessage, SendModerationActionMessage } = require("../../utils/MessageManager");
const { getModuleSettings } = require("../../utils/PermissionManager");
const { getUserFromInput } = require("../../utils/Resolver");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    const oldMessage = message; //save for original author, execution logging
    const interaction = (message.interaction) ? message.interaction : undefined;
    if (interaction) message = await interaction.fetchReply();

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(oldMessage, '@user was not provided', 4800);

    //get target user
    const target = await getUserFromInput(message.guild, arguments[0]);
    if (target == false) return ReplyErrorMessage(oldMessage, '@user was not found', 4800);

    //disconnect the target
    const disconnect = await target.voice.disconnect().catch(err => {
        ReplyErrorMessage(oldMessage, `An Error occured, and ${target.user.tag} was not disconnected`);
        return false
    })

    //check if action was succesfull
    if (disconnect != false) {
        //verify that the user has been disconnected
        if (interaction) interaction.editReply({ content: `**${target.user.tag}** has been disconnected from the voice-channel`, ephemeral: true });
        else message.reply(`**${target.user.tag}** has been disconnected from the voice-channel`).catch((err) => { });
        //get module settings, proceed if true
        const moderationAction = await getModuleSettings(message.guild, 'moderationAction');
        if (moderationAction.state === 1 && moderationAction.channel != null) {
            //don't log in channels that are excepted from logging
            if (moderationAction.exceptions.includes(message.channel.id)) return;
            return SendModerationActionMessage(oldMessage, module.exports.info.name, moderationAction.channel)
        }
    }
    return;
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
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}