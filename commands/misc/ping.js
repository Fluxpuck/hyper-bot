/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */



//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //return Client- and Discord Latency
    return message.reply('Pinging...').then(async (msg) => {
        msg.edit(`${client.user.username} ${msg.createdTimestamp - message.createdTimestamp}ms\nDiscord ${Math.round(client.ws.ping)}ms`);
    })

}


//command information
module.exports.info = {
    name: 'ping',
    alias: ['latency'],
    category: 'misc',
    desc: 'Check client and Discord latency',
    usage: '{prefix}ping',
}

module.exports.slash = {
    options: [{
        name: 'test',
        type: 'STRING',
        description: 'string',
        required: true,
    }]
}

module.exports.permission = {

}