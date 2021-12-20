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
    name: 'mute',
    alias: [],
    category: 'moderation',
    desc: 'Mute target member for X minutes in the server',
    usage: '{prefix}mute @user [time]',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'user',
        type: 'USER',
        description: 'Mention target user',
        required: true,
    },
    {
        name: 'time',
        type: 'STRING',
        description: 'Duration in minutes',
        required: true,
    }]
}