/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, guild, user) => {

    //get module settings, proceed if true
    const banRevokeModule = await getModuleSettings(guild.id, 'banRevoke');
    if (banRevokeModule.state === 1 && banRevokeModule.channel != null) {





    }










}