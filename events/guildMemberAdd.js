/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

module.exports = async (client, guild, user) => {

    guildMemberRemove = {
        "name": "guildLeave",
        "desc": "Send a log-message, when a member is leaving server",
        "state": "",
        "chnl": ""
    },
    {
        "name": "kick",
        "desc": "Send a log-message, when a member is kicked",
        "state": "",
        "chnl": ""
    }

    //get module settings, proceed if true
    const guildLeave = await getModuleSettings(guild, 'ban');
    if (guildLeave.state === 1 && guildLeave.channel != null) {





    }

    //get module settings, proceed if true
    const kick = await getModuleSettings(guild, 'ban');
    if (kick.state === 1 && kick.channel != null) {





    }









}