/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//require modules
const { getPendingMutes, removePendingMute } = require('../database/QueryManager');
const { getUserFromInput } = require('../utils/Resolver');

module.exports = async (client) => {

    //go through each guild
    Array.from(client.guilds.cache.values()).forEach(async guild => {

        //await for pending mutes from database
        const pendingMutes = await getPendingMutes(guild.id);
        for (let i = 0; i < pendingMutes.length; i++) {

            //setup values
            const { targetId, pendingTime } = pendingMutes[i];

            //if timeout time is in the past, trigger event
            if (new Date(pendingTime) - Date.now() < 0) {

                //get member details
                const member = await getUserFromInput(guild, targetId);
                if (member != false) {
                    //change member value to null and trigger event
                    member.communicationDisabledUntilTimestamp = pendingTime
                    client.emit('guildMemberUpdate', member, member);
                }

                //remove from database
                return await removePendingMute(guild.id, targetId);
            }
        }
    })
    return;
}