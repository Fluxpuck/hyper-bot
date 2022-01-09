/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

module.exports = async (client, oldMember, newMember) => {

    guildMemberUpdate = {
        "name": "timeout",
        "desc": "Send a log-message, when a member is muted",
        "state": "",
        "chnl": ""
    },
    {
        "name": "timeoutRevoke",
        "desc": "Send a log-message, when a member is unmuted",
        "state": "",
        "chnl": ""
    },
    {
        "name": "jail",
        "desc": "Send a member to jail, when a member is muted",
        "state": "",
        "chnl": ""
    },
    {
        "name": "changeNickname",
        "desc": "Send a log-message, when a member changed their nickname",
        "state": "",
        "chnl": ""
    },
    {
        "name": "changeAvatar",
        "desc": "Send a log-message, when a member changed their avatar",
        "state": "",
        "chnl": ""
    }











    //setup TimeOut values
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp != null ? new Date(oldMember.communicationDisabledUntilTimestamp) : null
    const newTimeout = newMember.communicationDisabledUntilTimestamp != null ? new Date(newMember.communicationDisabledUntilTimestamp) : null
    //new TimeOut, if new timeout time is in the future
    if (newTimeout - Date.now() > 0) {
        //calculate timeout time, rounded to nearest 1000's
        const duration = ((newTimeout - Date.now()) / 1000).toFixed() * 1000

        console.log(duration)

        //check if jail-role is available
        //fetch jail-role
        //give member jail-role


        //check if target is already in database
        //else check audit log add to database logs & pending

    }
    //remove TimeOut, if an timeout has been removed
    if (oldTimeout != null && newTimeout == null) {

        console.log('Timeout has been removed')

        console.log(oldTimeout)
        console.log(newTimeout)


        //check if member has jail-role
        //remove jail-role

    }






}