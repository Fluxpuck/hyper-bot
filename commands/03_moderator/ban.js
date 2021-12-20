/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    console.log(message.author)
    console.log(arguments)
    console.log(prefix)
    console.log(permissions)


}


//command information
module.exports.info = {
    name: 'ban',
    alias: [],
    category: 'moderation',
    desc: 'Ban target member from the server',
    usage: '{prefix}ban @user [reason] ',
}

//slash setup
module.exports.slash = {
    slash: true,
    options: [{
        name: 'user',
        type: 'USER',
        description: 'Mention target user',
        required: true,
    },
    {
        name: 'reason',
        type: 'STRING',
        description: 'Reason for ban',
        required: true,
    }]
}