const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomID:String,
    playerCount:Number,
    onGoing:Boolean
},{
    collection:'roomCollection'
})

module.exports = mongoose.model('roomCollection',roomSchema)