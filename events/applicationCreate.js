/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//load required modules
const { ErrorMessage } = require("../utils/MessageManager");
const { getChannelfromInput } = require("../utils/Resolver");

module.exports = async (client, interaction) => {

    //get important information from interaction
    const { guild, message, member } = interaction;

    //return if applyId is null or if server doesnt have threads enabled
    if (guild.applyId == null) return;
    if (!guild.features.includes('THREADS_ENABLED')) return;

    //get channel information
    const channel = await getChannelfromInput(guild, guild.applyId);
    const threadchannels = await guild.channels.fetchActiveThreads();
    const threads = threadchannels.threads.map(channel => channel);

    //check if there is already a thread for this person
    for await (let thread of threads) {
        if (thread.name.includes(member.user.username)) {
            // Reply to the interaction and fetch the response
            return interaction.reply({ ephemeral: true, embeds: [await ErrorMessage(`You have already applied, please check <#${thread.id}>`)] })
        }
    }

    //create a new private thread and add the member to it
    await channel.threads.create({
        name: `Application - ${member.user.username}`,
        autoArchiveDuration: 7 * 24 * 60, //one week
        type: 'GUILD_PRIVATE_THREAD',
        invitable: false,
        reason: `Application thread for ${member.user.username} - ${member.user.id}`,
    }).then(async threadChannel => {
        //add member to thread
        await threadChannel.members.add(member.user.id);
        // Reply to the interaction and fetch the response
        return interaction.reply({ ephemeral: true, content: `A private channel has been opened for you!\nStart you application process here: <#${threadChannel.id}>` })
    }).catch(async err => {
        //update defer
        await interaction.reply({ ephemeral: true, embeds: [await ErrorMessage(`Oops. Something went wrong.`)] })
    })

    return;
}