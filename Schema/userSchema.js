const mongoose = require(`mongoose`)


const userSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    blocked: {type: Boolean, default: false}
})

module.exports = mongoose.model(`User-Model`, userSchema)