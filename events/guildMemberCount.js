/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

module.exports = async (client) => {

    //go through each guild
    Array.from(client.guilds.cache.values()).forEach(async guild => {

        //check if membercount has been setup
        if (guild.membercountId === null) return;
        if (guild.membercountId === undefined) return;

        //get channel & change name
        const channel = await guild.channels.cache.get(guild.membercountId);
        var channelName = (channel.name).replace(new RegExp(/\d+/g), guild.memberCount);
        if (channel) return channel.setName(channelName).catch((err) => { });

    })
    return;
}