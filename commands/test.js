/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//require packages
const { sqlQuery } = require('../database/connection');

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    // console.log(message)
    // console.log(arguments)
    // console.log(prefix)
    // console.log(permissions)

    // console.log(await sqlQuery(`SELECT prefix FROM global_guildinformation WHERE guildId = ${message.guild.id}`))

    console.log(client.permissions)

}


//command information
module.exports.info = {
    name: 'test',
    alias: ['testing'],
    category: 'misc',
    desc: 'Just for testing purposes',
    usage: '{prefix}test',
}
//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'test',
        type: 'STRING',
        description: 'string',
        required: true,
    }]
}