/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    The ClientManager contains all functions required for the bot client */

//require packages
const fs = require('fs');

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

    }

}