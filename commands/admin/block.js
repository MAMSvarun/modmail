const discord = require(`discord.js`)
const userSchema = require(`../../Schema/userSchema`)

module.exports.run = async(Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.guild) return
    if(!message.member.permissions.has(discord.Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({content:`**Only Mods and Admins can use this command.**`}).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000);   
    })


    const member = message.mentions.members.first()
    if(!member) return message.reply({content: `**Please mention a User to block them from using ModMail.**`}).then(msg => {
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 5000);   
    })

    let userData
    try {
        userData = await userSchema.findOne({
            userId: member.id
        })
        if(!userData) {
            userData = await userSchema.create({
                userId: member.id
            })
        }

        if(userData.blocked == true) return message.reply({content: `**That user is already blocked from using modmail.**`}).then(msg => {
            setTimeout(() => {
                msg.delete()
                message.delete()
            }, 5000);   
        })

        userData.blocked = true
        await userData.save()
        
        message.channel.send({embeds: [
            new discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`**Blocked** ***${member.user.tag}*** **from using modmail.**`)
            .setTimestamp()
        ]})

        message.delete()
    } catch (error) {
        console.log(error)
    }
}

module.exports.help = {
    name: `block`,
    aliases: []
}