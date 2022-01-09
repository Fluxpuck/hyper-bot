/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, message) => {

    //return if message is from a BOT
    if (message.author.bot === false) return;


    //get module settings, proceed if true
    const messageDelete = await getModuleSettings(message.guild.id, 'messageDelete');
    if (messageDelete.state === 1 && messageDelete.channel != null) {





    }









}