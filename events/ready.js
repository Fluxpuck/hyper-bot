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

    //get and initialize interactive commands  
    //SLASH COMMANDS!!??

    //check and update all database tables
    Array.from(client.guilds.cache.values()).forEach(async guild => {
        await DbManager.UpdateGuildTable(); //update (global) guild information table
        await DbManager.UpdateCommandTable(guild.id); //update (guild) command permission tables
        await DbManager.UpdateCommandInformation(guild.id, client.commands); //update (individual) commands
        await DbManager.UpdateLogTable(guild.id); //update (guild) log tables
        await DbManager.UpdateMutesTable(guild.id); //update (guild) pending mutes table
        await DbManager.UpdateModulesTable(guild.id); //update (guild) module table
        await DbManager.UpdateModuleInformation(guild.id); //update (individual) modules
    });

    //get and cache guild prefix, command permissions and module settings
    await PermissionManager.loadGuildPrefixes(client); //cache guild prefixes
    await PermissionManager.loadCommandPermissions(client); //cache command permissions
    await PermissionManager.loadModuleSettings(client); //cache module settings

    //set client activity
    await ClientManager.setClientActivity(client);

    //finalize with the Console Messages
    ClientConsole.WelcomeMessage();
    ClientConsole.EventMessage(client.events);
    ClientConsole.CommandMessage(client.commands);

}