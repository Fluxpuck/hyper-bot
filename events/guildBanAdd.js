/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

const { getModuleSettings } = require("../database/QueryManager")

module.exports = async (client, guild, user) => {

    guildBanAdd = {
        "name": "ban",
        "desc": "Send a log-message, when a member is banned",
        "state": "",
        "chnl": ""
    }

    //get module settings, proceed if true
    const banModule = await getModuleSettings(guild, 'ban');
    if (banModule.state === 1 && banModule.channel != null) {





    }










}