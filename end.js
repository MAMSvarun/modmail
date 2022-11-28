const discord = require(`discord.js`)

module.exports.run = async (Client, message, args, prefix) => {
    if (!message.content.startsWith(prefix)) return
    if(!message.guild) return
    if (!message.member.permissions.has(discord.Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({ content: `**Only Admins and Mods can use this comamnd.**` }).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000)
    })

    const mainGuild = Client.guilds.cache.get(`859441727421284362`)
    const modmailCategory = `897454464506679306`
    const logChannel = mainGuild.channels.cache.get(`897454509289259069`)
    const premier = mainGuild.roles.cache.get(`888718513445957712`)
    const squadleaders = mainGuild.roles.cache.get(`888719122383392788`)

    if (message.channel.parentId != modmailCategory) return message.reply({ content: `**This command can be used only in ModMail Threads.**` }).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000)
    })

    if (message.channel.id == logChannel.id) return message.reply({ content: `**This command can be used only in ModMail Threads.**` }).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000)
    })

    message.channel.send({ content: '**Deleting channel in 5seconds..**' })
    setTimeout(() => {
        Client.users.cache.get(message.channel.name).send({
            embeds: [new discord.MessageEmbed().setDescription(`**The Chat Ticket is Closed.**`).setColor('GREEN').setTimestamp()]
        })
        message.channel.delete().then((ch) => {
            logChannel.send({
                embeds: [new discord.MessageEmbed().setDescription(`**${Client.users.cache.get(ch.name).tag}** ModMail thread has been Closed.\n**Closed by** ${message.author}`).setColor('BLURPLE').setTimestamp()]
            })
        })
    }, 5000)

    return;





}

module.exports.help = {
    name: `end`,
    aliases: []
}