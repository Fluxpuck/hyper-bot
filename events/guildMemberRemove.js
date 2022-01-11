/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const embed = require('../assets/embed.json');

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, member) => {

    //get module settings, proceed if true
    const guildLeave = await getModuleSettings(member.guild, 'guildLeave');
    if (guildLeave.state === 1 && guildLeave.channel != null) {





    }

    //get module settings, proceed if true
    const kick = await getModuleSettings(member.guild.id, 'kick');
    if (kick.state === 1 && kick.channel != null) {





    }








}