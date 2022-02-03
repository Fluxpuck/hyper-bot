/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The PermissionManager handles all guild and command permissions for the bot client  */

//require packages
const NodeCache = require("node-cache");
const { defaultPrefix, ownerIds } = require('../config/config.json');
const { getGuildPrefix, getCommandPerms, getModuleSets, getGuildConfig } = require("../database/QueryManager");
const { getUserFromInput } = require("./Resolver");

//build cache
const guildCommandPermsCache = new NodeCache();
const guildModulePermsCache = new NodeCache();

module.exports = {

    /** set guild prefix permission for all guilds
     * @param {Object} client
     */
    async loadGuildPrefixes(guild) {
        var prefix = await getGuildPrefix(guild.id); //get prefix from database
        if (prefix == undefined || prefix == null || prefix == false) prefix = defaultPrefix; //set prefix value
        guild.prefix = prefix; //set custom Hyper values and save in guild
    },

    /** set guild prefix roles for all guilds
     * @param {Object} client
     */
    async loadGuildConfiguration(guild) {
        const { modId, jailId, applyId, reportId, handshake, slash } = await getGuildConfig(guild.id); //get roles from database
        //set custom Hyper values and save in guild
        guild.modId = modId;
        guild.jailId = jailId;
        guild.applyId = applyId;
        guild.reportId = reportId;
        guild.handshake = handshake;
        guild.slash = slash;
    },

    /** set all command permissions per guild
     * @param {*} client 
     */
    async loadCommandPermissions(guild) {
        var collection = await getCommandPerms(guild.id); //get command permissions from database
        await guildCommandPermsCache.set(guild.id, collection); //add to cache
    },

    /** set all module permissions per guild
     * @param {*} client 
     */
    async loadModuleSettings(guild) {
        var collection = await getModuleSets(guild.id); //get module settings from database
        await guildModulePermsCache.set(guild.id, collection); //add to cache
    },

    /** get command permissions
     * @param {*} guild 
     * @param {*} messageCommand 
     * @returns 
     */
    async getCommandPermissions(guild, messageCommand) {
        const CommandCache = await guildCommandPermsCache.get(guild.id) //get the prefix key value from the cache
        const filter = CommandCache.filter(c => c.commandName === messageCommand);
        if (filter.length > 0) {
            var role_perms = filter[0].rolePerms != null ? filter[0].rolePerms.split(',') : null
            var channel_perms = filter[0].channelPerms != null ? filter[0].channelPerms.split(',') : null
            return { "role_perms": role_perms, "channel_perms": channel_perms }
        } else {
            return { "role_perms": null, "channel_perms": null }
        }
    },

    /** check command permissions
     * @param {*} message 
     * @param {*} command 
     * @param {*} permissions 
     * @returns 
     */
    async checkCommandPermissions(message, command, permissions) {
        function commandPermissions(commandName, status, rolePerms, channelPerms, adminPerms, message) {
            this.commandName = commandName;
            this.status = status;
            this.rolePermValidation = rolePerms;
            this.channelPermValidation = channelPerms;
            this.adminValidation = adminPerms;
            this.message = errorMsg;
        }

        //setup key values
        const member = await getUserFromInput(message.guild, message.author.id)
        const channel = message.channel
        let commandStatus = false, errorMsg = ""

        //setup role and channel permissions
        var role_permissions = permissions.role_perms === null ? [] : permissions.role_perms
        var channel_permissions = permissions.channel_perms === null ? [] : permissions.channel_perms

        //check permissions
        var role_check = role_permissions.filter(r => member.roles.cache.has(r));
        var channel_check = channel_permissions.filter(c => channel.id === c);

        //get validations
        let role_validation = role_check.length > 0 ? true : false
        let channel_validation = channel_check.length > 0 || permissions.channel_perms === null ? true : false
        let administrator = member.permissions.has("ADMINISTRATOR");

        //error messages
        if (administrator != true) {
            if (role_validation === false) errorMsg += 'You do not access to this command.'
            if (channel_validation === false) errorMsg += 'This command can not be used in this channel.'
        }

        //validations
        if (ownerIds.includes(member.id)) commandStatus = true
        if (role_validation === true && channel_validation === true) commandStatus = true
        else if (administrator === true) commandStatus = true

        //return status
        return new commandPermissions(command, commandStatus, role_validation, channel_validation, administrator, errorMsg)
    },

    /** get module settings
     * @param {*} guild 
     * @param {*} module 
     */
    async getModuleSettings(guild, module) {
        const ModuleCache = await guildModulePermsCache.get(guild.id) //get the prefix key value from the cache
        const filter = ModuleCache.filter(m => m.moduleName === module);
        if (filter.length > 0) {
            return { "state": filter[0].state, "channel": filter[0].channel, "exceptions": filter[0].exceptions }
        } else {
            return { "state": 0, "channel": null, "exceptions": [] }
        }
    },

    //module export the cache
    guildCommandPermsCache,
    guildModulePermsCache

}