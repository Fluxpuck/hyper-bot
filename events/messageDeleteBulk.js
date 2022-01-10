/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, messages) => {

    //get first message {guild} and other values
    const message = messages.first();

    //get module settings, proceed if true
    const messageBulkDelete = await getModuleSettings(message.guild, 'messageBulkDelete');
    if (messageBulkDelete.state === 1 && messageBulkDelete.channel != null) {





    }









}