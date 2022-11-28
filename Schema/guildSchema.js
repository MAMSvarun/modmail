const mongoose = require(`mongoose`)


const guildSchema = new mongoose.Schema({
    guildId: {type: String, required: true},
    closed: {type: Boolean, default: false}
})

module.exports = mongoose.model(`Guild-Config`, guildSchema)