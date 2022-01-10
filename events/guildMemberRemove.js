/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, member) => {

    //get module settings, proceed if true
    const guildJoin = await getModuleSettings(member.guild, 'guildJoin');
    if (guildJoin.state === 1 && guildJoin.channel != null) {





    }

    //get module settings, proceed if true
    const guildWelcome = await getModuleSettings(member.guild.id, 'guildWelcome');
    if (guildWelcome.state === 1 && guildWelcome.channel != null) {





    }








}