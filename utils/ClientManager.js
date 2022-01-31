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

    /** create slash commands
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
                permission: slash.permission,
                defaultPermission: slash.defaultPermission
            }, guildId)
        }
    },

    /** update slash commands
     * @param {*} guild 
     * @param {*} slashCommands 
     */
    async updateSlashCommands(client, guild, slashCommands) {
        await client.application?.fetch() //fetch all commands
        await guild.commands.fetch().then(async commandlist => {
            if (commandlist.size <= 0) return //return if no commands are fetched
            for await (const [key, value] of commandlist.entries()) {
                //get dito result from client and slashcommands
                const slashcommand = slashCommands.filter(slash => slash.name == value.name)
                if (slashcommand.length === 1) {

                    //update existing command
                    await client.application.commands.edit(key, {
                        name: slashcommand[0].name,
                        description: slashcommand[0].description,
                        options: slashcommand[0].options,
                        defaultPermission: slashcommand[0].defaultPermission,
                    }, [guild.id]).catch(err => console.log('update command', err));

                    //if command has permissions, set them up
                    if (slashcommand[0].permission.length >= 1) {
                        //update permissions
                        await client.application.commands.permissions.set({
                            guild: guild.id,
                            command: key,
                            permissions: slashcommand[0].permission
                        }).catch(err => console.log('update command perms', err));
                    } else {
                        //update permissions
                        await client.application.commands.permissions.set({
                            guild: guild.id,
                            command: key,
                            permissions: []
                        }).catch(err => console.log('update command perms', err));
                    }
                } else {
                    ///disable existing command
                    await client.application.commands.permissions.set({
                        guild: guild.id,
                        command: key,
                        permissions: []
                    }).catch(err => console.log('disable command', err));
                }
                if (slashcommand.length === 0) {
                    //remove existing command
                    await client.application.commands.delete(key, [guild.id])
                        .catch(err => console.log('remove command', err));
                }
            }
        })
    }




}