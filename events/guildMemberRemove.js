/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

module.exports = async (client, guild, user) => {

    guildMemberAdd = {
        "name": "guildJoin",
        "desc": "Send a log-message, when a member is joining the server",
        "state": "",
        "chnl": ""
    },
    {
        "name": "guildWelcome",
        "desc": "Send a welcome message, when a member is joining server",
        "state": "",
        "chnl": ""
    }


    //get module settings, proceed if true
    const guildJoin = await getModuleSettings(guild, 'ban');
    if (guildJoin.state === 1 && guildJoin.channel != null) {





    }

    //get module settings, proceed if true
    const guildWelcome = await getModuleSettings(guild, 'ban');
    if (guildWelcome.state === 1 && guildWelcome.channel != null) {





    }








}