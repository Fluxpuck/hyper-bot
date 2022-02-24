/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const wait = require('util').promisify(setTimeout);

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    await setTimeout(() => message.delete().catch((err) => { }), 100)

    await wait(3000);

    return message.reply('This is a reply!')
        .then(msg => { setTimeout(() => msg.delete().catch((err) => { }), 4800) }) //delete message after
        .catch((err) => { });


}


//command information
module.exports.info = {
    name: 'test',
    alias: ['testing'],
    category: '',
    desc: 'Just for testing purposes',
    usage: '{prefix}test',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}