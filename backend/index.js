require('dotenv').config()
const roomCollection = require('./model/roomSchema')
const boardCollection = require('./model/boardSchema')
// const express = require('express')
// const cors = require("cors");
// const app = express();
// const body_parser = require("body-parser");
const connectDB = require('./data/dbConnect')
const http = require('http')
const { Server } = require("socket.io")
const { Character, Hero1, Hero2, Pawn } = require('./gameLogic/gameLogic')








const port = process.env.PORT_NUMBER;

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

const dbConnect = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to Database")
    } catch (error) {
        console.log(error)
    }

}
dbConnect()

let allRooms = []
io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)
    // for (room of io.sockets.adapter.rooms){
    //     allRooms.push(room)
    // }
    // console.log("Sending io.stream ",io.sockets.adapter.rooms)
    socket.emit("getAllRooms",{data:allRooms})

    socket.on('joinRoom', async (data) => {
        try {
            let roomId = data.roomID
            allRooms.push(roomId)
            // console.log(roomId)
            let tempRoom = await roomCollection.findOne({ roomID: roomId, onGoing: true })
            // console.log(tempRoom)
            if (tempRoom) {
                // console.log("yes tempRoom")
                if (tempRoom.onGoing) {
                    if (tempRoom.playerCount >= 2) {
                        socket.emit("roomFullError", { roomId, data: "Room is full" })
                    }
                    else {
                        await roomCollection.findOneAndUpdate({ roomID: roomId }, { $inc: { playerCount: 1 } })
                        socket.join(roomId)
                        socket.emit('waitingForOtherPlayer', { roomId, roomId: roomId, side: "Red" })
                        // console.log(io.sockets.adapter.rooms.get(roomId))
                        io.to(roomId).emit('letsPlay')

                    }
                }
            }
            else {
                await roomCollection.create({ roomID: roomId, playerCount: 1, onGoing: true })
                await boardCollection.create({ roomID: roomId, sNO: 0, board: [[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]] })
                socket.join(roomId)
                // console.log(io.sockets.adapter.rooms.get(roomId))
                socket.emit('waitingForOtherPlayer', { roomId, roomId: roomId, side: "Blue" ,pCount:1})
            }


        }
        catch (error) {
            console.log(error)
        }
    })

    socket.on('leaveRoom', async (data) => {
        console.log(`User ${socket.id} left!!!`)
        let { roomId } = data
        await roomCollection.findAndUpdate({ roomID: roomId }, { $inc : {playerCount: - 1 }})
        socket.leave(roomId)
    })

    socket.on("getBoard", async (data) => {
        let { roomID } = data
        await boardCollection.findOne({ roomID: roomID })

    })

    socket.on("setFirstBoard", async (data) => {
        let { roomID, side, firstRow } = data;
        // socket.join(roomID)
        // console.log(roomID, side, firstRow)
        let index = 0;
        if (side == "Red") {
            index = 4;
            firstRow.reverse()
        }
        // else {
        //     firstRow.reverse()
        // }
        let newBoard = await boardCollection.findOneAndUpdate({ roomID: roomID }, { $set: { [`board.${index}`]: firstRow }, $inc: { sNO: 1 } }, { new: true })
        // console.log(io.sockets.adapter.rooms.get(roomID))
        // console.log(newBoard)
        io.to(roomID).emit("getFirstBoard", { roomID: roomID, newBoard: newBoard.board, sNO: newBoard.sNO })
    })

    // socket.on("setBoard", async (data) => {
    //     let { roomID, side,position } = data;
    //     if (side == "Red") {
    //         position[0] = (position[0] % 4)
    //         position[1] = (position[1] % 4)
    //     }
    //     console.log(`${position[0]},${position[1]}`+ piece)
    //     let newBoard = boardCollection.findOneAndUpdate({ roomID: roomID }, { $set: { [`board.${position[0]}.${position[1]}`]: piece } })

    //     io.to(roomID).emit('getBoard', (newBoard))
    // })

    socket.on("makeMove", async (data) => {
        let { start, end, side, roomID, piece } = data
        console.log("index.js line 134 data ->" , start,end,side,piece)
        let curBoard = await boardCollection.findOne({ roomID: roomID });
        curBoard = curBoard.board;
        if (side == "R") {
            start[0] = 4-start[0] 
            end[0] = 4-end[0]

            start[1] = 4-start[1]
            end[1] = 4- end[1]
        }
        else{
            start[1] = start[1]
            end[1] = end[1]
        }
        start[0] = parseInt(start[0])
        end[0] = parseInt(end[0])
        start[1] = parseInt(start[1])
        end[1] = parseInt(end[1])
        if (piece != "2") {
            if (start[0] == end[0]) {
                if (start[1] < end[1]) {
                    for (let starty = start[1]+1; starty <= end[1]; starty++) {
                        if (curBoard[start[0]][starty] != null) {
                            curBoard[start[0]][starty] = null
                        }
                    }
                }
                else {
                    for (let starty = start[1]-1; starty >= end[1]; starty--) {
                        if (curBoard[start[0]][starty] != null) {
                            curBoard[start[0]][starty] = null
                        }
                    }
                }
            }
            else if (start[1] == end[1]) {
                if (start[0] < end[0]) {
                    for (let startx = parseInt(start[0])+1; startx <= end[0]; startx++) {
                        if (curBoard[startx][start[1]] != null) {
                            curBoard[startx][start[1]] = null
                        } 
                    }
                }
                else {
                    for (let startx = start[0]-1; startx >= end[0]; startx--) {
                        if (curBoard[startx][start[1]] != null) {
                            curBoard[startx][start[1]] = null
                        }
                    }

                }
            }

        }
        else if (piece == "2") {
            if (start[0] < end[0] && start[1] < end[1]) {
                let startx = start[0] + 1
                let starty = start[1] + 1

                while (startx <= end[0] && starty <= end[1]) {
                    if (curBoard[startx][starty] != null) {
                        curBoard[startx][starty] = null
                    }
                    startx += 1
                    starty += 1

                }

            }
            else if (start[0] < end[0] && start[1] > end[1]) {
                let startx = start[0] + 1
                let starty = start[1] - 1

                while (startx <= end[0] && starty >= end[1]) {
                    if (curBoard[startx][starty] != null) {
                        curBoard[startx][starty] = null
                    }
                    startx += 1
                    starty -= 1
                }
            }
            else if (start[0] > end[0] && start[1] > end[1]) {
                let startx = start[0] - 1
                let starty = start[1] - 1

                while (startx >= end[0] && starty >= end[1]) {
                    if (curBoard[startx][starty] != null) {
                        curBoard[startx][starty] = null
                    }
                    startx -= 1
                    starty -= 1

                }
            }
            else if (start[0] > end[0] && start[1] < end[1]) {
                let startx = start[0] - 1
                let starty = start[1] + 1

                while (startx >= end[0] && starty <= end[1]) {
                    if (curBoard[startx][starty] != null) {
                        curBoard[startx][starty] = null
                    }
                    startx -= 1
                    starty += 1

                }
            }



        } 

        curBoard[end[0]][end[1]]=curBoard[start[0]][start[1]]
        curBoard[start[0]][start[1]] = null
        
        console.log('line 247' , start, end, side, piece, roomID, curBoard)
        let winner = await charCount(curBoard)
        if (winner==0){
            await boardCollection.findOneAndUpdate({roomID:roomID},{board:curBoard} , {$inc:{sNO:1}})
            io.to(roomID).emit("setBoard",{ roomID: roomID, newBoard: curBoard}) 
        }
        else if (winner==1){
            io.to(roomID).emit("gameOver",{winner:"R"})
        }
        else{
            io.to(roomID).emit("gameOver",{winner:"B"}) 
        }





    })

    // socket.on("getAllRoooms",(data)=>{
    //     let reply = io.sockets.adapter.rooms
    //     console.log(io.sockets.adapter.rooms)
    //     socket.emit("getAllRooms",{data:reply})
    // })

})

httpServer.listen(port, () => { console.log("Server listening") })

async function charCount(board) {
    bCount=0
    rCount=0
    for(let i=0;i<5;i++){
        for(let j=0;j<5;j++){
            if(board[i][j]==null){

            }
            else if(board[i][j][0]=='B'){
                bCount+=1
            }
            else{
                rCount+=1
            }
        }
    }

    if(bCount==0){
        return 1
    }
    else if (rCount==0){
        return -1
    }
    else{
        return 0
    }

}





