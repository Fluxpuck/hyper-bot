/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

module.exports = async (client, guild, user) => {

    guildBanRemove = {
        "name": "banRevoke",
        "desc": "Send a log-message, when a member is unbanned",
        "state": "",
        "chnl": ""
    }

    //get module settings, proceed if true
    const banRevokeModule = await getModuleSettings(guild, 'banRevoke');
    if (banRevokeModule.state === 1 && banRevokeModule.channel != null) {





    }










}