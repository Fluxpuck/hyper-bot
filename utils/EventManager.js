/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    The EventManager setup and triggers all Discord Events */

//load required modules
const { readdirSync } = require('fs');
const { join } = require('path');

//run and export module
module.exports.run = (client) => {

    //set directory path to events and read files
    const filePath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(filePath);

    //go through all events and bind to Client
    for (const file of eventFiles) {
        const event = require(`${filePath}/${file}`)
        const eventName = file.split('.').shift()
        client.on(eventName, event.bind(null, client))
        client.events.set(eventName, { name: eventName, file: file })
    }

}