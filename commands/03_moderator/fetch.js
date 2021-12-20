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
    name: 'fetch',
    alias: ['whois'],
    category: 'moderation',
    desc: 'Get user-information from the target member',
    usage: '{prefix}fetch @user',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: []
}