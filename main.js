/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    Hyper is a comprehensive Discord moderation bot, developed for private use.
    Developed on Discord.js v13.3.0 and Discord Rest API v9 */

//get credentials through dot envoirement
require('dotenv').config({ path: './config/.env' });

//get Intents BitField from config
const { INTENTS_BITFIELD } = require('./config/Intents');

//setup DiscordJS Client
const { Client, Collection } = require('discord.js');
const client = new Client({
    intents: INTENTS_BITFIELD,
    ws: { properties: { $browser: 'Discord Android' } }
});

//set Client dependencies 
client.commands = new Collection();
client.events = new Collection();
client.dependencies = require('./package.json').dependencies
client.version = require('./package.json').version

//listen to Client events
const events = require('./utils/EventManager');
events.run(client);

//client login to discord
client.login(process.env.TOKEN);