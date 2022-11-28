const discord = require(`discord.js`)
const guildSchema = require(`../../Schema/guildSchema`)

module.exports.run = async(Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.guild) return
    if(!message.member.permissions.has(discord.Permissions.FLAGS.MANAGE_GUILD)) return message.reply({content:`**Only Mods and Admins can use this command.**`}).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000);   
    })

    

    let guildData
    try {
        guildData = await guildSchema.findOne({
            guildId: message.guild.id
        })
        if(!guildData) {
            guildData = await guildSchema.create({
                guildId: message.guild.id
            })
        }

        if(guildData.closed == true) return message.reply({content: `**ModMail is already closed.**`}).then(msg => {
            setTimeout(() => {
                msg.delete()
                message.delete()
            }, 5000);   
        })

        guildData.closed = true
        await guildData.save()
        
        message.channel.send({embeds: [
            new discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`**ModMail is closed now.**`)
            .setTimestamp()
        ]})

        message.delete()
    } catch (error) {
        console.log(error)
    }
}

module.exports.help = {
    name: `close`,
    aliases: []
}