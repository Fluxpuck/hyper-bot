/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//load required modules
const { join } = require('path');
const commandFolder = join(__dirname, '..', 'commands');

//require Managers
const ClientConsole = require('../utils/ConsoleManager');
const ClientManager = require('../utils/ClientManager');
const DbManager = require('../database/DbManager');
const PermissionManager = require('../utils/PermissionManager');
const { insertGuild } = require('../database/QueryManager');

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
        await DbManager.UpdateLogTable(guild.id); //update (guild) log tables
        await DbManager.UpdateMutesTable(guild.id); //update (guild) pending mutes table
        await DbManager.UpdateModulesTable(guild.id); //update (guild) module table
        await DbManager.UpdateModuleInformation(guild.id); //update (individual) modules

        await insertGuild(guild); //double check guild in global guild information

        await PermissionManager.loadGuildPrefixes(guild); //cache guild prefixes
        await PermissionManager.loadGuildConfiguration(guild); //set guild config
        await PermissionManager.loadCommandPermissions(guild); //cache command permissions
        await PermissionManager.loadModuleSettings(guild); //cache module settings
    }

    //get and initialize interactive commands per guild
    for await (let guild of guilds) {
        if (guild.slash === 1) { //if slash commands are enabled
            //get slash commands
            const slashCommands = await ClientManager.getSlashCommands(client.commands, guild)
            await ClientManager.registerSlashCommands(client, slashCommands, guild.id);
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