const discord = require(`discord.js`)

module.exports.run = async(Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.guild) return
    if(!message.member.permissions.has(discord.Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({content: `**Only Admins and Mods can use this command.**`}).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        })
    })

    message.channel.send({embeds: [
        new discord.MessageEmbed()
        .setColor(`BLURPLE`)
        .setAuthor({name: Client.user.username, iconURL: Client.user.displayAvatarURL({dynamic: true})})
        .setTitle(`ModMail Bot commands`)
        .setThumbnail(Client.user.displayAvatarURL({dynamic: true}))
        .setDescription(`**ModMail bot Help Section.**`)
        .addField('\u200b', '\u200b')
        .addFields(
            {name:`__m!open__`, value: `Sets the ModMail open, so others can use the it.`},
            {name: `__m!close__`, value: `Sets the ModMail close, so others can't use it.`},
            {name: `__m!block__`, value: `Blocks the mentioned user from using the modmail.`},
            {name: `__m!unblock__`, value: `Unblocks the mentioned user from using the modmail.`},
            {name: `__m!end__`, value: `Closes a modmail thread.`},
            {name: `__m!dm__`, value: `Sends your message to the mentioned user and creates a modmail thread.`}
        )
        .setFooter({text: `Developed by Levi Ackerman#8058`})
    ]})

    message.delete()
}

module.exports.help = {
    name: `help`,
    aliases: []
}