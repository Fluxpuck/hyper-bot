/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */


//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {


    const collect_message = new MessageEmbed()
        .setTitle(`Button Collector!`)
        .setDescription(`This message is gonna collect button presses`)
        .setFooter({ text: `help me` })

    await message.channel.send({
        embeds: [collect_message],
        components: [apply_button],
    })


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
    options: [
        {
            name: 'channel',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_NEWS_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
            description: 'Where should I talk?',
            required: true,
        }
    ],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}