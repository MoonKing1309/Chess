const { boolean } = require('mathjs')
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomID:String,
    playerCount:Number,
    onGoing:boolean
},{
    collection:'roomCollection'
})

module.exports = mongoose.model('roomCollection',roomSchema)