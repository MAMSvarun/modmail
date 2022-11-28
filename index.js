require(`dotenv`).config()
const Discord = require(`discord.js`)
const Client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS],
    partials: [`CHANNEL`]
})

const fs = require(`fs`)

Client.commands = new Discord.Collection()
Client.aliases = new Discord.Collection()


const mongoose = require(`mongoose`)
mongoose.connect(process.env.MONGOOSE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(console.log('Connected to Mongo.db'))

const userSchema = require(`./Schema/userSchema`)
const guildConfig = require(`./Schema/guildSchema`)

Client.on('ready', async () => {
    Client.user.setActivity(`DM for help`, { type: `WATCHING` })
    console.log(`NamelessHero modmail bot is ready`);
})



// Commands Handler 

// get into the cmds folder
fs.readdirSync('./commands/').forEach(dir => {

    //in the cmds folder, we gonna check for the category
    fs.readdir(`./commands/${dir}`, (err, files) => {

        // console log err (catch err)
        if (err) throw err;

        // checking if the files ends with .js if its a javascript file
        var jsFiles = files.filter(f => f.split(".").pop() === "js");

        // if there is no cmds in the file it will return
        if (jsFiles.length <= 0) {
            console.log("Can't find any commands!");
            return;
        }


        jsFiles.forEach(file => {

            // console the loaded cmds 
            var fileGet = require(`./commands/${dir}/${file}`);
            console.log(`File ${file} was loaded`)

            // gonna let the cmds run
            try {
                Client.commands.set(fileGet.help.name, fileGet);

                // it search in the cmds folder if there is any aliases
                fileGet.help.aliases.forEach(alias => {
                    Client.aliases.set(alias, fileGet.help.name);

                })


            } catch (err) {
                // catch err in console  
                return console.log(err);
            }
        });
    });
});



Client.on("messageCreate", async message => {
    if (message.author.bot) return


    let UserData;
    try {
        UserData = await userSchema.findOne({
            userId: message.author.id
        })
        if (!UserData) {
            UserData = await userSchema.create({
                userId: message.author.id
            })
        }

        UserData.save()
    } catch (error) {
        console.log(error)
    }

    let guildData
    try {
        guildData = await guildConfig.findOne({
            guildId: `859441727421284362`
        })
        if (!guildData) {
            guildData = await guildConfig.create({
                guildId: `859441727421284362`
            })
        }
        guildData.save()

    } catch (error) {
        console.log(error)
    }

    const mainGuild = Client.guilds.cache.get(`859441727421284362`)
    const modmailCategory = `897454464506679306`
    const logChannel = mainGuild.channels.cache.get(`897454509289259069`)
    const premier = mainGuild.roles.cache.get(`888718513445957712`)
    const squadleaders = mainGuild.roles.cache.get(`888719122383392788`)


    //defining prefix and args
    let prefix = `m!`
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1)

    let commands = Client.commands.get(cmd.slice(prefix.length)) || Client.commands.get(Client.aliases.get(cmd.slice(prefix.length)));

    if (commands) commands.run(Client, message, args, prefix)



    if (message.channel.type === `DM`) {


        if (UserData.blocked == true) return message.author.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`TICKET NOT OPENED`)
                    .setDescription(`**You are Blocked from using the ModMail.**\nPlease try to contact the mods directly.`)
                    .setTimestamp()
            ]
        })


        if (guildData.closed == true) return message.author.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`MODMAIL CLOSED`)
                    .setDescription(`**ModMail is closed.**\nPlease contact later..`)
                    .setTimestamp()
            ]
        })

        const checkChannel = !!mainGuild.channels.cache.find((ch) => ch.name === message.author.id)
        if (checkChannel === true) {
            const mailChannel = mainGuild.channels.cache.find((ch) => ch.name === message.author.id)

            if (message.attachments && message.content === '') {
                mailChannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor('GOLD')
                        .setImage(message.attachments.first().proxyURL)
                        .setTimestamp()]
                })
            } else {
                mailChannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor('GOLD')
                        .setDescription(message.content)
                        .setTimestamp()]
                })
            }
        } else if (checkChannel === false) {
            const mailChannel = await mainGuild.channels.create(message.author.id, {
                type: 'GUILD_TEXT',
                parent: modmailCategory,
                permissionOverwrites: [
                    {
                        id: mainGuild.id,
                        deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                    },

                    {
                        id: premier.id,
                        allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.ATTACH_FILES, Discord.Permissions.FLAGS.EMBED_LINKS, Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY]
                    },

                    {
                        id: squadleaders.id,
                        allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.ATTACH_FILES, Discord.Permissions.FLAGS.EMBED_LINKS, Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY]
                    },

                    {
                        id: Client.user.id,
                        allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.ATTACH_FILES, Discord.Permissions.FLAGS.EMBED_LINKS, Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY]
                    }
                ]
            })
            logChannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setDescription(`**${message.author.tag}** has Created a modmail thread.\n**Thread -> **${mailChannel}`)
                    .setColor('GREEN')
                    .setTimestamp()]
            })

            mailChannel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor(`DEFAULT`)
                        .setTitle(`NEW TICKET!`)
                        .setDescription(`**Ticket opened by ${message.author}**`)
                        .setTimestamp()
                ]
            })
            if (message.attachments && message.content === '') {
                mailChannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor('GOLD')
                        .setImage(message.attachments.first().proxyURL)
                        .setFooter({ text: 'Please type m!end to close the Thread.' })
                        .setTimestamp()]
                })
            } else {
                mailChannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor('GOLD')
                        .setDescription(message.content)
                        .setFooter({ text: 'Please type m!end to close the Thread.' })
                        .setTimestamp()]
                })
            }
        }
    } else {
        if (!message.guild) return
        if (message.guild.id === mainGuild.id && message.channel.parentId === modmailCategory) {


            try {
                const user = Client.users.cache.get(message.channel.name)
                if(!user) return

                if (message.attachments && message.content === '') {
                    user.send({
                        embeds: [new Discord.MessageEmbed()
                            .setAuthor({ name: 'ModMail' })
                            .setColor('BLURPLE')
                            .setImage(message.attachments.first().proxyURL)
                            .setTimestamp()]
                    })
                } else {
                    user.send({
                        embeds: [new Discord.MessageEmbed()
                            .setAuthor({ name: 'ModMail' })
                            .setColor('BLURPLE')
                            .setDescription(message.content)
                            .setTimestamp()]
                    })
                }
            } catch (error) {
                console.log(error)
            }

        }
    }


})



Client.login(process.env.TOKEN)
