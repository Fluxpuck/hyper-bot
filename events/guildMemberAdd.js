/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, member) => {

    //get module settings, proceed if true
    const guildLeave = await getModuleSettings(member.guild.id, 'ban');
    if (guildLeave.state === 1 && guildLeave.channel != null) {





    }

    //get module settings, proceed if true
    const kick = await getModuleSettings(member.guild.id, 'ban');
    if (kick.state === 1 && kick.channel != null) {





    }



    //check if "communicationDisabledUntilTimestamp" is set and in the present
    //if so, give muted role :clown:







}