/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    Hyper is a comprehensive Discord moderation bot, developed for private use.
    Developed on Discord.js v13.3.0 and Discord Rest API v9 */

//get credentials through dot envoirement
require('dotenv').config({ path: './config/.env' });
var cron = require('node-cron');

//get Intents BitField from config
const { INTENTS_BITFIELD } = require('./config/Intents');

//setup DiscordJS Client
const { Client, Collection } = require('discord.js');
const client = new Client({
    intents: INTENTS_BITFIELD,
    ws: { properties: { $browser: 'Discord Android' } }
});

//set Client information 
client.commands = new Collection();
client.events = new Collection();
client.dependencies = require('./package.json').dependencies
client.version = require('./package.json').version

//listen to Client events
const events = require('./utils/EventManager');
events.run(client); //run the events

//listen to Pending mutes, every 1 minute
const { getPendingMutes, removePendingMute } = require('./database/QueryManager');
const { getUserFromInput } = require('./utils/Resolver');
cron.schedule('* * * * *', () => {

    //go through each guild
    Array.from(client.guilds.cache.values()).forEach(async guild => {

        //await for pending mutes from database
        const pendingMutes = await getPendingMutes(guild.id);
        for (let i = 0; i < pendingMutes.length; i++) {

            //setup values
            const { targetId, pendingTime } = pendingMutes[i];

            //if timeout time is in the past, trigger event
            if (new Date(pendingTime) - Date.now() < 0) {

                //get member details
                const member = await getUserFromInput(guild, targetId);
                if (member != false) {
                    //change member value to null and trigger event
                    member.communicationDisabledUntilTimestamp = pendingTime
                    client.emit('guildMemberUpdate', member, member);
                }

                //remove from database
                return await removePendingMute(guild.id, targetId);
            }
        }
    })
})

//client login to discord
client.login(process.env.TOKEN);