/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { join } = require('path');
const commandFolder = join(__dirname, '..', 'commands');
const { Collection } = require('discord.js');

//require Managers
const ClientConsole = require('../utils/ConsoleManager');
const ClientManager = require('../utils/ClientManager');
const DbManager = require('../database/DbManager');
const PermissionManager = require('../utils/PermissionManager');
const { insertGuild, getTimedMessages } = require('../database/QueryManager');

//exports "ready" event
module.exports = async (client) => {

    //find all client commandfiles
    async function fileLoader(fullFilePath) {
        if (fullFilePath.endsWith(".js")) {
            let props = require(fullFilePath)
            client.commands.set(props.info.name, props)
        }
    }

    //get and initialize client commands
    await ClientManager.getClientCommands(commandFolder, { dealerFunction: fileLoader })

    //check and update all database tables
    const guilds = Array.from(client.guilds.cache.values())
    for await (let guild of guilds) {
        await DbManager.UpdateGuildTable(); //update (global) guild information table
        await DbManager.UpdateCommandTable(guild.id); //update (guild) command permission tables
        await DbManager.UpdateCommandInformation(guild.id, client.commands); //update (individual) commands
        await DbManager.UpdateCustomCommandsTable(guild.id); //update (guild) custom command table
        await DbManager.UpdateTimedMessagesTable(guild.id); //update (guild) timed message table
        await DbManager.UpdateLogTable(guild.id); //update (guild) log tables
        await DbManager.UpdateMutesTable(guild.id); //update (guild) pending mutes table
        await DbManager.UpdateModulesTable(guild.id); //update (guild) module table
        await DbManager.UpdateModuleInformation(guild.id); //update (individual) modules
        await DbManager.UpdateAwayTable(guild.id); //update (guild) away tables
        await DbManager.UpdateStatusTable(guild.id); //update (guild) status tables

        await insertGuild(guild); //double check guild in global guild information

        await PermissionManager.loadGuildPrefixes(guild); //cache guild prefixes
        await PermissionManager.loadGuildConfiguration(guild); //set guild config
        await PermissionManager.loadCommandPermissions(guild); //cache command permissions
        await PermissionManager.loadCustomCommands(guild); //cache custom commands
        await PermissionManager.loadModuleSettings(guild); //cache module settings
    }

    // get and initialize interactive commands per guild
    for await (let guild of guilds) {
        //get slash commands
        const slashCommands = await ClientManager.getSlashCommands(client.commands, guild)
        await guild.commands.fetch().then(async commandlist => {
            if (commandlist.size <= 0) {
                if (guild.slash === 1) {
                    //register Slash Commands if enabled in guild
                    return ClientManager.registerSlashCommands(client, slashCommands, guild.id);
                } else {
                    //delete Slash Commands if disabled in guild
                    return ClientManager.removeSlashCommands(client, guild);
                }
            } else {
                //update slash commands
                return ClientManager.updateSlashCommands(client, guild, slashCommands); //update slash commands
            }
        });
    }

    //get and initialize timed messages per guild
    for await (let guild of guilds) {
        //get timed messages from database
        var timedMessageCollection = await getTimedMessages(guild.id);
        //check if there are timed messages setup
        if (timedMessageCollection.length >= 1) {
            //add timed message to 
            client.emit('TimedMessage', guild, timedMessageCollection);
        }
    }

    //set client activity
    await ClientManager.setClientActivity(client);

    //finalize with the Console Messages
    ClientConsole.WelcomeMessage();
    ClientConsole.EventMessage(client.events);
    ClientConsole.CommandMessage(client.commands);

    return;
}