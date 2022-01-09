/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The AuditManager contains functions related to Logging Audits and Moderator actions */

//require packages
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdef', 12);
const { getMemberLogs, saveMemberLog } = require("../database/QueryManager");

module.exports = {

    /** construct hyperLog and save to database
     * @param {*} message 
     * @param {*} type 
     * @param {*} target 
     * @param {*} reason 
     * @returns 
     */
    async createHyperLog(message, type, duration, target, reason) {
        function hyperLog(log, reason, duration, target, executor) {
            this.log = log;
            this.reason = reason;
            this.duration = duration;
            this.target = target;
            this.executor = executor;
        }
        //construct hyperlog
        const UserLog = new hyperLog({ id: nanoid(), type: type }, reason, duration, { id: target.user.id, username: target.user.tag }, { id: message.author.id, username: message.author.tag });
        //save to database
        await saveMemberLog(message.guild.id, UserLog);
        //return hyperlog
        return UserLog
    },

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
    },

    /** get ban information on target
     * @param {*} guild 
     * @param {*} target 
     */
    async FetchBanLog(message, target) {
        function BanDetails(target, reason, date) {
            this.target = target;
            this.reason = reason;
            this.date = date;
        }
        //get ban information on target
        const fetchBans = await message.guild.bans.fetch(target.id)
            .catch(err => { return false }) //return if nothing came up
        //if no ban logs were found, return false
        if (fetchBans == false) return false
        //return ban details
        return new BanDetails({ id: fetchBans.user.id, username: `${fetchBans.user.username}#${fetchBans.user.discriminator}` }, fetchBans.reason, undefined)
    },

    /** Filter Hyper and Audit Ban logs
     * @param {*} target 
     * @param {*} HyperLogs 
     * @param {*} BanLogs 
     */
    async FilterTargetLogs(target, HyperLogs, BanLogs) {
        function TargetLogs(target, status, reason, date) {
            this.target = target;
            this.status = status;
            this.reason = reason;
            this.date = date;
        }

        //setup empty values
        var logReason, logDate, targetStatus

        //if target username is undefined, fetch info from logs
        if (target.user.username == undefined) {
            //filter for simularities between ban and hyper logs
            const HyperBan = HyperLogs.filter(log => { return log.type === 'ban' && log.target.id == BanLogs.target.id && log.reason == BanLogs.reason })
            const HyperKick = HyperLogs.filter(log => { return log.type === 'kick' })

            //if target username is unpresent, fetch form Audits
            if (target.user.username == undefined) {
                target.user.username = HyperLogs[0].target.username || HyperKick[0].target.username
            }

            //setup or alter target status
            if (HyperBan.length >= 1) { targetStatus = 'banned', BanLogs.date = HyperBan[0].date }
            else if (HyperKick.length >= 1) { targetStatus = 'kicked' }
            else { targetStatus = 'left' }

            switch (targetStatus) {
                case 'banned':
                    logReason = BanLogs.reason
                    logDate = HyperBan.length >= 1 ? HyperBan[0].date.create : undefined
                    break;
                case 'kicked':
                    logReason = HyperKick[0].reason
                    logDate = HyperKick[0].date.create
                    break;
                case 'left':
                    logReason = undefined
                    logDate = undefined
                    break;
            }

        }

        //return value
        return new TargetLogs({ id: target.user.id, username: target.user.username }, targetStatus, logReason, logDate)
    },






}