/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

const { updateSlashCommands, getSlashCommands } = require("../utils/ClientManager")
const { ReplyErrorMessage } = require("../utils/MessageManager")

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {


    // const slashCommands = await getSlashCommands(client.commands, message.guild)
    // await updateSlashCommands(client, message.guild, slashCommands)

    // client.emit('kaas', client, message, slashCommands);

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