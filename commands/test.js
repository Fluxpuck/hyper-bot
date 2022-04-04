/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    // //get channel information
    // const channel = await getChannelfromInput(message.guild, message.guild.applyId);
    // const thread = channel.threads.cache.find(x => x.name === 'Application - Holy Ultra');

    // console.log(thread)

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