/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    The Resolver contains all functions parsing and collecting information */

//require packages
const mysql = require('mysql');
const { MessageMentions: { USERS_PATTERN, CHANNELS_PATTERN, ROLES_PATTERN }, Collection } = require('discord.js');

module.exports = {

    /** Get user information from input
     * @param {Collection} guild 
     * @param {String} input 
     * @returns 
     */
    async getUserFromInput(guild, input) {
        if (!input) return false;

        //filter input
        let mention = new RegExp('<@!?([0-9]+)>', 'g').exec(input)
        let item = mention != null ? mention[1] : input.trim()

        //fetch member from guild
        try {
            var member = await guild.members.fetch(item)
                || await guild.members.cache.get(item)
                || await guild.members.cache.find(m => m.id == item)

            //if member value is present, return member
            if (!member) return false;
            else return member;

        } catch (err) {
            return false
        }

    },

    /** Get channel information from input
     * @param {*} guild 
     * @param {*} input 
     */
    async getChannelfromInput(guild, input) {
        if (!input) return false;

        let channel //setup channel value

        //filter input [1]
        let mention = new RegExp('<#([0-9]+)>', 'g').exec(input)
        let item = mention != null ? mention[1] : input.trim()

        //filter input [2]
        let filter = mysql.escape(item.replace(',', ''))
        let filter_item = filter.substring(1).slice(0, -1).trim()

        //get Channel by id
        if (filter_item.match(/^[0-9]+$/)) {
            channel = await guild.channels.cache.get(filter_item) //get channel straight from channel cache
            if (!channel) { channel = await guild.channels.cache.find(channel => channel.id == filter_item) } //find channel in channel cache
            else if (!channel) { channel = await guild.channels.fetch(filter_item) } //fetch channel straight from guild
            //if channel is found (by id) return channel
            if (channel) return channel;
        }

        //if channel value is still empty, return false
        if (!channel) return false;

    },

    /** Get user X amount of user messages
    * @param {*} message 
    * @param {*} member 
    * @param {*} limit 
    * @returns 
    */
    async getUserMessages(message, member, limit) {

        //setup the message collection
        let messageCollection = new Collection;

        //get last message from channel
        let LastMessage = await message.channel.messages.fetch({ limit: 1, force: true });
        LastMessage = ([...LastMessage.values()].length > 0) ? [...LastMessage.values()][0] : null

        //add first message to message collection
        messageCollection.set(LastMessage.id, LastMessage)

        //keep fetching messages, till collection is full or last message is null
        while (messageCollection.size < limit) {

            //collect messages in chunks of 50
            const options = { before: LastMessage.id, limit: 50 } //set filter options
            let FetchMessages = await message.channel.messages.fetch(options); //collect messages from target channel
            if (member != undefined) FetchMessages.sweep(message => message.author.id != member.user.id); //remove messages not from target member

            //filter messages for NOT older than two weeks and within limit
            await FetchMessages.map(message => {
                if (OlderThanTwoWeeks(message.createdTimestamp) == false &&
                    messageCollection.size < limit) messageCollection.set(message.id, message);
            })

            //set last message for further loop
            LastMessage = ([...FetchMessages.last(1)].length > 0) ? [...FetchMessages.last(1)][0] : null
            if (LastMessage === null) break; //if there is no last message, break
            if (OlderThanTwoWeeks(LastMessage.createdTimestamp) == true) break; //if last message is older than 2 weeks, break

        }

        //return collection
        return messageCollection;

        //small function to check if message timestamp is older than two weeks or not
        function OlderThanTwoWeeks(timestamp) {
            //setup the times 
            const now = +new Date()
            const messageTime = +new Date((timestamp))
            const TwoWeeks = 14 * 60 * 60 * 24 * 1000

            //return true or false
            return (now - messageTime) > TwoWeeks
        }
    },

    /** get input type for purge
     * @param {*} guild 
     * @param {*} input 
     * @returns 
     */
    async inputType(guild, input) {

        //create return array
        let typeArray = { "member": false, "amount": null }

        //handle input (Array)
        let input_string = Array.isArray(input) ? input.toString() : input
        let input_array = input_string.split(',')

        //await for the loop to finish
        await input_array.forEach(async item => {
            if (item.length > 10) {
                const target = await module.exports.getUserFromInput(guild, item) //get member value
                typeArray.member = target //set member value
            }
            if (item.length < 5) {
                typeArray.amount = item  //set amount value
            }
        });

        return typeArray //return to outcome
    }

}