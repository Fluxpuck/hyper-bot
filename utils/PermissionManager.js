/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The PermissionManager handles all guild and command permissions for the bot client  */

//require packages
const NodeCache = require("node-cache");
const { defaultPrefix } = require('../config/config.json');
const { getGuildPrefix } = require("../database/QueryManager");

//build cache
const guildPrefixCache = new NodeCache();
const guildCommandPermsCache = new NodeCache();

module.exports = {

    //set guild prefix permission for all guilds
    async initiateGuildPrefixes(client) {
        Array.from(client.guilds.cache.values()).forEach(async guild => {
            var prefix = await getGuildPrefix(guild.id); //get prefix from Guild
            if (prefix == undefined || prefix == null || prefix == false) prefix = defaultPrefix; //set prefix value
            await guildPrefixCache.set(guild.id, { prefix: prefix }) //add to cache
        })
    },

    //get Guild prefix
    async getGuildPrefix(guild) {
        const GuildCache = guildPrefixCache.get(guild.id) //get the prefix key value from the cache
        const prefix = (GuildCache == undefined) ? defaultPrefix : GuildCache.prefix //set prefix from cache, else get default prefix
        return prefix //return the prefix
    },






    //module export the cache
    guildPrefixCache,
    guildCommandPermsCache

}