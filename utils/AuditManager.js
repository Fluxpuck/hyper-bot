/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The AuditManager contains functions related to Logging Audits and Moderator actions */

//require packages
const { getMemberLogs } = require("../database/QueryManager");

module.exports = {

    /** collect all (saved) Userlogs 
     * @param {*} message 
     * @param {*} target 
     * @returns 
     */
    async FetchHyperLogs(message, target) {
        //get all member logs from database
        const HyperLogs = await getMemberLogs(message.guild.id, target.id)
        //return empty array if false
        if (HyperLogs == false) return [];
        //return values
        return HyperLogs
    }

}