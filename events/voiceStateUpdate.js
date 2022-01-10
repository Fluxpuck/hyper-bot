/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { getModuleSettings } = require("../utils/PermissionManager");

module.exports = async (client, oldMember, newMember) => {

    //get module settings, proceed if true
    const voiceJoin = await getModuleSettings(oldMember.guild, 'voiceJoin');
    if (voiceJoin.state === 1 && voiceJoin.channel != null) {





    }

    //get module settings, proceed if true
    const voiceChange = await getModuleSettings(oldMember.guild, 'voiceChange');
    if (voiceChange.state === 1 && voiceChange.channel != null) {





    }

    //get module settings, proceed if true
    const voiceLeave = await getModuleSettings(oldMember.guild, 'voiceLeave');
    if (voiceLeave.state === 1 && voiceLeave.channel != null) {





    }









}