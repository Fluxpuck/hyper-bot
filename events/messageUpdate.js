/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, oldMessage, newMessage) => {

    //get module settings, proceed if true
    const messageChange = await getModuleSettings(oldMessage.guild.id, 'messageChange');
    if (messageChange.state === 1 && messageChange.channel != null) {





    }









}