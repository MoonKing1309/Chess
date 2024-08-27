const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
    roomID:String,
    sNO:Number,
    board:Array(5),
},{
    collection:'boardCollection'
})

module.exports = mongoose.model('boardcollection',boardSchema)