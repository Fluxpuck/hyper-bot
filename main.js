/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    Hyper is a comprehensive Discord moderation bot, developed for private use.
    Developed on Discord.js v13.3.1 and Discord Rest API v9 */

//get credentials through dot envoirement
require('dotenv').config({ path: './config/.env' });
var cron = require('node-cron');
const NodeCache = require("node-cache");

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
client.cooldowns = new NodeCache();
client.dependencies = require('./package.json').dependencies
client.version = require('./package.json').version

//listen to Client events
const events = require('./utils/EventManager');
events.run(client); //run the events

//listen to Pending mutes, every 1 minute
cron.schedule('*/1 * * * *', () => {
    client.emit('pendingMutes');
})

//update Status Dashboard, every 1 minute
cron.schedule('*/15 * * * *', () => {
    client.emit('statusDashboard');
})

//check if guild is activated, every day
cron.schedule('0 0 1 * * *', () => {
    client.emit('guildLeave');
})

//client login to discord
client.login(process.env.TOKEN);