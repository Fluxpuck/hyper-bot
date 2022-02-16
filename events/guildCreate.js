/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This event is triggers by Discord and does processing of data  */

//import styling from assets
const { MessageEmbed } = require('discord.js');
const embed = require('../assets/embed.json');

//require modules
const DbManager = require('../database/DbManager');
const PermissionManager = require('../utils/PermissionManager');

//require config
const { reportChannel } = require('../config/config.json');

module.exports = async (client, guild) => {

    //check and update all database tables
    await DbManager.UpdateGuildTable(); //update (global) guild information table
    await DbManager.UpdateCommandTable(guild.id); //update (guild) command permission tables
    await DbManager.UpdateCommandInformation(guild.id, client.commands); //update (individual) commands
    await DbManager.UpdateCustomCommandsTable(guild.id) //update (guild) custom command table
    await DbManager.UpdateLogTable(guild.id); //update (guild) log tables
    await DbManager.UpdateMutesTable(guild.id); //update (guild) pending mutes table
    await DbManager.UpdateModulesTable(guild.id); //update (guild) module table
    await DbManager.UpdateModuleInformation(guild.id); //update (individual) modules

    //update and cache guild prefix, config, command permissions and module settings
    await PermissionManager.loadGuildPrefixes(guild); //cache guild prefixes
    await PermissionManager.loadGuildConfiguration(guild); //set guild config
    await PermissionManager.loadCommandPermissions(guild); //cache command permissions
    await PermissionManager.loadCustomCommands(guild); //cache custom commands
    await PermissionManager.loadModuleSettings(guild); //cache module settings

    //setup guild's first text channel
    const textchannels = await guild.channels.fetch()
    const channels = textchannels.filter(channel => channel.type == 'GUILD_TEXT').map(channel => channel)
    const channel = channels.sort((a, b) => a.rawPosition - b.rawPosition)[0]
    const roles = await guild.roles.fetch()
    const owner = await guild.fetchOwner({ force: true });

    //check if guild has handshake
    if (guild.handshake != null) {

        //construct message
        const handshakeMessage = new MessageEmbed()
            .setTitle(`Guild Activated!`)
            .setDescription(`Thank you for adding me! Your guild has been **activated**, and is now ready to be used.`)
            .addFields(
                { name: `\u200b`, value: `To get started, please use the \`${guild.prefix}help\` command.`, inline: false },
                { name: `\u200b`, value: `If you'd like to change the prefix, use \`${guild.prefix}prefix [input]\`.`, inline: false }
            )
            .setColor(embed.color)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: false }))
            .setFooter({ text: `Version ${client.version}` })

        //get target channel and send message embed
        if (channels) return channel.send({ embeds: [handshakeMessage] });

    } else {

        //construct message
        const handshakeMessage = new MessageEmbed()
            .setTitle(`Thank you for adding me!`)
            .setDescription(`Hello! I am <@${client.user.id}>, a comprehensive server management bot, that allows for basic moderation, logging events, and more!`)
            .addFields(
                { name: `Activation`, value: `A notification has been send to \`Fluxpuck#0001\`. Please wait for his approval, before the bot becomes activated.`, inline: false },
                { name: `\u200b`, value: `Developed with ❤️ by Fluxpuck#0001`, inline: false }
            )
            .setColor(embed.color)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: false }))
            .setFooter({ text: `Version ${client.version}` })

        //get target channel and send message embed
        if (channels) channel.send({ embeds: [handshakeMessage] });

        //create reportEmbed
        let reportEmbed = new MessageEmbed()
            .setTitle(`${client.user.tag} joined ${guild.name}`)
            .addFields(
                { name: 'Guild Owner', value: `<@${owner.user.id}> | ${owner.user.tag} | ${owner.user.id}`, inline: false },
                { name: 'Guild Description', value: `\`\`\`${guild.description}\`\`\``, inline: false },
                { name: 'Channels', value: `\`\`\`${guild.channels.channelCountWithoutThreads}\`\`\``, inline: true },
                { name: 'Roles', value: `\`\`\`${roles.size}\`\`\``, inline: true },
                { name: 'Member Count', value: `\`\`\`${guild.memberCount}\`\`\``, inline: true },
                { name: 'Premium', value: `\`\`\`${guild.premiumTier}\`\`\``, inline: true },
                { name: 'Boosters', value: `\`\`\`${guild.premiumSubscriptionCount}\`\`\``, inline: true },
                { name: 'Guild Created at', value: `\`\`\`${guild.createdAt.toLocaleString()}\`\`\``, inline: false },
            )
            .setThumbnail(guild.iconURL())
            .setColor(embed.color)
            .setTimestamp()
            .setFooter({ text: `${guild.id}` })

        //get report channel and send report embed
        client.channels.fetch(reportChannel)
            .then(channel => channel.send({ embeds: [reportEmbed] }))

    }
    return;
}