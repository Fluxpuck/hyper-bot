/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License
    For more information on the commands, please visit hyperbot.cc  */

//require packages
const { Collection } = require('discord.js');
const fetch = require("node-fetch");

//load required modules
const { ReplyErrorMessage } = require("../../utils/MessageManager");
const { findUserFromName } = require("../../utils/Resolver");

//construct the command and export
module.exports.run = async (client, message, arguments, prefix, permissions) => {

    //if there are no arguments, no target has been defined
    if (arguments.length < 1) return ReplyErrorMessage(message, 'roleId was not provided', 4800);
    if (message.attachments.size < 1) return ReplyErrorMessage(message, 'No attachments were provided', 4800);

    //get role from arguments
    const targetRole = message.guild.roles.cache.find((r) => r.id === arguments[0])
    if (!targetRole) return ReplyErrorMessage(message, 'Role was not found', 4800);

    //preset value with all members
    let memberCollection = new Collection;

    //setup attachment file
    const attachFile = message.attachments.first();
    //fetch attachment
    const response = await fetch(attachFile.attachment);
    const body = await response.json();

    //check if body length isn't greater than 5000
    if (body.length > 2000) return ReplyErrorMessage(message, 'Memberlist contains more than 5000 items and is too big', 4800);

    //inform user we fetching the members from the list
    let messageReply = await message.channel.send(`<a:loading:746326030771421283> *Fetching and adding roles to ${body.length} members*`)

    try { //iterate over the file
        for await (let name of body) {
            //find username and details in guild
            const fetchMember = await findUserFromName(message.guild, name);
            if (fetchMember != false) {
                //setup member value and add to collection
                const member = fetchMember.first();
                memberCollection.set(member.id, member);
                //add role to member
                member.roles.add(targetRole, `Add mass-role to member`)
                    .catch((err) => { });
                //edit message
                messageReply.edit(`<a:loading:746326030771421283> *Added role to ${memberCollection.size} of ${body.length} members...*`)
                    .catch((err) => { });
            }
        }
    } catch (error) {
        console.log(error)
        return ReplyErrorMessage(message, 'Memberlist is not iterable', 4800);
    }

    //edit message
    messageReply.edit(`*Done! A total of ${memberCollection.size} members have received their role!*`)
        .catch((err) => { });

    return;
}

//command information
module.exports.info = {
    name: 'mass-role',
    alias: [],
    category: 'management',
    desc: 'Give role to a list of member members',
    usage: '{prefix}mass-role RoleId',
}

//slash setup
module.exports.slash = {
    slash: false,
    options: [{
        name: 'userId',
        type: 'STRING',
        description: 'Mention target user',
        required: true,
    }],
    permission: [],
    defaultPermission: false,
    ephemeral: true
}