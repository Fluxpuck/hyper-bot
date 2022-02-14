/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    /*
    Send message with all options:
        - Enable/Disable Command
        - Set Role(s)
        - Set Channel(s)
    */








}


//command information
module.exports.info = {
    name: 'command',
    alias: [],
    category: 'setup',
    desc: 'Setup the a command through an interactive setup',
    usage: '{prefix}command',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}