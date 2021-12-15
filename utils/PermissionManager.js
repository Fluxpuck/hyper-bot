/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The PermissionManager handles all guild and command permissions for the bot client  */

//require packages
const NodeCache = require("node-cache");
const { defaultPrefix } = require('../config/config.json');
const { getGuildPrefix, getCommandPerms } = require("../database/QueryManager");
const { getUserFromInput } = require("./Resolver");

//build cache
const guildPrefixCache = new NodeCache();
const guildCommandPermsCache = new NodeCache();

module.exports = {

    //set guild prefix permission for all guilds
    async loadGuildPrefixes(client) {
        Array.from(client.guilds.cache.values()).forEach(async guild => {
            var prefix = await getGuildPrefix(guild.id); //get prefix from database
            if (prefix == undefined || prefix == null || prefix == false) prefix = defaultPrefix; //set prefix value
            await guildPrefixCache.set(guild.id, { prefix: prefix }) //add to cache
        })
    },

    //get Guild prefix
    async getGuildPrefix(guild) {
        const GuildCache = await guildPrefixCache.get(guild.id); //get the prefix key value from the cache
        const prefix = (GuildCache == undefined) ? defaultPrefix : GuildCache.prefix //set prefix from cache, else get default prefix
        return prefix //return the prefix
    },

    //set all command permissions per guild
    async loadCommandPermissions(client) {
        Array.from(client.guilds.cache.values()).forEach(async guild => {
            var collection = await getCommandPerms(guild.id); //get command permissions from database
            await guildCommandPermsCache.set(guild.id, collection); //add to cache
        })
    },

    //get command permissions
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

    //check command permissions
    async checkCommandPermissions(message, command, permissions) {
        function commandValidation(commandName, status, rolePerms, channelPerms, adminPerms, message) {
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
        // let administrator = member.permissions.has("MANAGE_GUILD");
        let administrator = false

        //error messages
        if (role_validation === false) errorMsg += 'You do not access to this command.'
        if (channel_validation === false) errorMsg += 'This command can not be used in this channel.'

        //validations
        if (role_validation === true && channel_validation === true) commandStatus = true
        else if (administrator === true) commandStatus = true

        //return status
        return new commandValidation(command, commandStatus, role_validation, channel_validation, administrator, errorMsg)
    },


    //module export the cache
    guildPrefixCache,
    guildCommandPermsCache

}