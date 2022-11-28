const discord = require(`discord.js`)


module.exports.run = async (Client, message, args, prefix) => {
    if (!message.content.startsWith(prefix)) return
    if(!message.guild) return
    if (!message.member.permissions.has(discord.Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({ content: `**Only Admins and Mods can run this command.**` }).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000);
    })

    const member = message.mentions.members.first()
    if (!member) return message.reply({ content: `**Please mention a User to DM them.**` }).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000);
    })

    const text = args.slice(1).join(` `)
    if (!text) return message.reply({ content: `**Please provide some Text to send to that User**.` }).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000);
    })

    const mainGuild = Client.guilds.cache.get(`859441727421284362`)
    const modmailCategory = `897454464506679306`
    const logChannel = mainGuild.channels.cache.get(`897454509289259069`)
    const premier = mainGuild.roles.cache.get(`888718513445957712`)
    const squadleaders = mainGuild.roles.cache.get(`888719122383392788`)

    const checkChannel = !!mainGuild.channels.cache.find((ch) => ch.name === `${member.id}`)
    if (checkChannel === true) {
        message.reply({ content: `**A ticket is already opened to for that user. Message them there.**` }).then(msg => {
            setTimeout(() => {
                msg.delete()
                message.delete()
            }, 5000);
        })

        return;
    } else if (checkChannel === false) {

        member.send({
            embeds: [
                new discord.MessageEmbed()
                    .setAuthor({ name: `ModMail` })
                    .setColor(`BLURPLE`)
                    .setDescription(`${text}`)
                    .setTimestamp()
            ]
        })


        let channel = await mainGuild.channels.create(`${member.id}`, {
            type: `GUILD_TEXT`,
            parent: modmailCategory,
            permissionOverwrites: [
                {
                    id: mainGuild.id,
                    deny: [discord.Permissions.FLAGS.VIEW_CHANNEL]
                },

                {
                    id: premier.id,
                    allow: [discord.Permissions.FLAGS.VIEW_CHANNEL, discord.Permissions.FLAGS.SEND_MESSAGES, discord.Permissions.FLAGS.ATTACH_FILES, discord.Permissions.FLAGS.EMBED_LINKS, discord.Permissions.FLAGS.READ_MESSAGE_HISTORY]
                },

                {
                    id: squadleaders.id,
                    allow: [discord.Permissions.FLAGS.VIEW_CHANNEL, discord.Permissions.FLAGS.SEND_MESSAGES, discord.Permissions.FLAGS.ATTACH_FILES, discord.Permissions.FLAGS.EMBED_LINKS, discord.Permissions.FLAGS.READ_MESSAGE_HISTORY]
                },

                {
                    id: Client.user.id,
                    allow: [discord.Permissions.FLAGS.VIEW_CHANNEL, discord.Permissions.FLAGS.SEND_MESSAGES, discord.Permissions.FLAGS.ATTACH_FILES, discord.Permissions.FLAGS.EMBED_LINKS, discord.Permissions.FLAGS.READ_MESSAGE_HISTORY]
                }
            ]
        })

        channel.send({
            embeds: [
                new discord.MessageEmbed()
                    .setColor(`DEFAULT`)
                    .setTitle(`NEW TICKET!`)
                    .setDescription(`**Ticket opened by ${message.author}**`)
                    .setTimestamp(),

                new discord.MessageEmbed()
                    .setColor(`GOLD`)
                    .setTimestamp()
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle(`${message.author.username} sent a DM to ${member.user.username}`)
                    .setDescription(`${text}`)
                    .setFooter({text: `Type m!end to close the thread.`})
            ]

        })

        logChannel.send({
            embeds: [
                new discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .setTimestamp()
                    .setDescription(`${message.author} has created a ModMail thread by sending a DM to ${member}\n**Thread -> **${channel}`)
            ]
        })

        return;
    }


}

module.exports.help = {
    name: `dm`,
    aliases: [`message`, `msg`]
}