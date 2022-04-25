/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//require modules
const { dropGuildTables, getGuildDate, deactivateGuild } = require('../database/QueryManager');
//require config
const { reportChannel } = require('../config/config.json');

module.exports = async (client) => {

    //go through each guild
    Array.from(client.guilds.cache.values()).forEach(async guild => {

        //check if guild is activated
        if (guild.handshake != null) return;

        //if guild is not activated, check if guild joined longer than 1 week
        const date = await getGuildDate(guild.id)
        if (OlderThanX(date) == true) {
            //leave guild
            await guild.leave()
                .then(g => { //get report channel and send report embed
                    client.channels.fetch(reportChannel)
                        .then(channel => channel.send(`**${client.user.username}** left ${g}, because it has been one week without activation!`))
                        .catch((err) => { });
                })
                .catch(err => { });
            //deactivate guild
            await deactivateGuild(guild.id);
            //drop all guild tables
            await dropGuildTables(guild.id)
        }
    })
    return;
}

//small function to check if message timestamp is older than two weeks or not
function OlderThanX(timestamp) {
    //setup the times 
    const now = +new Date()
    const dateTime = +new Date((timestamp))
    const X = 3 * 60 * 60 * 24 * 1000 //3 days

    //return true or false
    return (now - dateTime) > X
}