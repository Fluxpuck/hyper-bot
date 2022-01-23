/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    The ClientManager contains all functions required for the bot client */

//require packages
const fs = require('fs');
const { getCommandPermissions } = require('./PermissionManager');

//check if filepath is a directory
function isDir(filePath) {
    return (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory())
}

module.exports = {

    /** setup client Activity status
     * @param {Collection} client 
     */
    async setClientActivity(client) {
        // Set the client user's presence
        client.user.setPresence({ activities: [{ type: 'PLAYING', name: 'hyperbot.cc' }], status: 'online' });
    },

    /** go through all folders and setup client commands
     * @param {String} filePath 
     * @param {String} options 
     */
    async getClientCommands(filePath, options = {}) {

        if (!options.hasOwnProperty("dealerFunction")) Object.assign(options, { dealerFunction: 0 })
        if (!options.hasOwnProperty("initialDirectoryCheck")) Object.assign(options, { initialDirectoryCheck: true })
        if (!options.hasOwnProperty("print")) Object.assign(options, { print: false })

        if (options.dealerFunction == 0 && options.print == false) throw new Error(`No file dealer function provided`)
        if (typeof (options.dealerFunction) != "function" && options.print == false) throw new Error(`Dealer function provided is not a function`)

        let initCheck = isDir(filePath)

        if (options.initialDirectoryCheck && !initCheck) throw new Error(`File path provided (${filePath}) is not a folder / directory.`)

        if (initCheck) //checks whether the path is a folder
        {
            fs.readdirSync(filePath).forEach(file_in_folder => { // Through each file in the folder
                let new_path = `${filePath}/${file_in_folder}` // Construct a new path
                let secondaryCheck = isDir(new_path)
                if (secondaryCheck) module.exports.getClientCommands(new_path, { dealerFunction: options.dealerFunction, initialDirectoryCheck: false, print: options.print })
                else {
                    if (options.print) console.log(new_path)
                    else options.dealerFunction(new_path)
                }
            })
        }
        else //if not, fileLoader
        {
            if (options.print) console.log(filePath)
            else options.dealerFunction(filePath)
        }

    },

    /** filter all client commands for slash commands
     *  and add the command permissions from cache
     * @param {*} commands 
     */
    async getSlashCommands(commands, guild) {
        function slashCommand(name, description, options, permission) {
            this.name = name
            this.description = description
            this.options = options
            this.permission = permission
        }
        //filter all client commands for slash options, then put them in a new map
        const commandCollection = commands.filter(c => c.slash.slash == true).map(c => new slashCommand(c.info.name, c.info.desc, c.slash.options, c.slash.permission))
        for await (let command of commandCollection) {
            function permission(id, type, permission) {
                this.id = id
                this.type = type
                this.permission = permission
            }
            const { role_perms } = await getCommandPermissions(guild, command.name)
            if (role_perms != null) {
                const commandPermissions = await role_perms.map(r => new permission(r, 'ROLE', true))
                command.permission = commandPermissions
            }
        }
        return commandCollection
    },

    /** create or update slash commands
     * @param {*} client 
     * @param {*} guildId 
     */
    async registerSlashCommands(client, slashCommands, guildId) {
        await client.application?.fetch() //fetch current command information
        for await (let slash of slashCommands) {
            client.application.commands.create({
                name: slash.name,
                description: slash.description,
                options: slash.options,
                permission: slash.permission
            }, guildId)
        }
    }

}