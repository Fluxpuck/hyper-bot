/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, guild, user) => {

    //get module settings, proceed if true
    const banModule = await getModuleSettings(guild, 'ban');
    if (banModule.state === 1 && banModule.channel != null) {





    }










}