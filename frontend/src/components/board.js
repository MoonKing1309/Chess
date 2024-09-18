// import { forEach } from 'mathjs';
import './styles/board.css'
// import io from 'socket.io-client';

import { useEffect, useState, useRef } from 'react';

import { Character, Pawn, Hero1, Hero2, } from '../gameLogic';
import { isNull } from 'mathjs';
import { useNavigate } from 'react-router-dom';



// const socket = io.connect("http://localhost:5001");

// import { socketID, socket } from '../socket';


function Board(props) {

    const roomID = props.roomID[0];
    const setRoomID = props.roomID[1];
    const side = props.side[0];
    const setSide = props.side[1];
    const pCount = props.pCount[0];
    const setPCount = props.pCount[1];
    const socket = props.socket;
    const pTurn = props.pTurn[0];
    const setPTurn = props.pTurn[1];
    // console.log("settting stateeee")
    const [board, setBoard] = useState([[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]])
    // const [time, setTime] = useState(100000)

    const [pawn, setPawn] = useState(0)
    const [hero1, setHero1] = useState(0)

    const [hero2, setHero2] = useState(0)

    const [started, setStarted] = useState(false)

    const [piece, setPiece] = useState(null)
    // const [start, setStart] = useState(null)
    // const [end,setEnd ] = useState(null)

    const pieces = useRef(null)
    const start = useRef(null)
    const end = useRef(null)
    const validMoves = useRef(null)

    const navigate = useNavigate();


    const [possMoves, setPossMoves] = useState(null)

    useEffect(() => {
        // console.log("board here socket is " , socket)
        if (socket) {
            socket.on("getFirstBoard", (data) => {
                // console.log("side is " , data)
                if (side == "Blue") {
                    setBoard(data.newBoard)
                }
                else {
                    // console.log("First Board Reversinggg")
                    data.newBoard.forEach((value, index) => {
                        value.reverse()
                    })
                    setBoard(data.newBoard.reverse())
                }

                if (data.sNO >= 2) {
                    setStarted(true)

                }
            })

            socket.on("setBoard", (data) => {
                
                // console.log("<---------------------",pTurn,newPTurn,"--------------------->")
                if (side == "Blue") {
                    
                    setBoard(data.newBoard)
                }
                else {
                    
                    // data.newBoard.forEach((row, rowIndex) => {
                    //     const rowString = row.map((item, colIndex) => `${item}`).join(' | ');
                    //     console.log(`Row ${rowIndex}: ${rowString}`);
                    // });
                    if (pTurn=='R'){
                        // console.log("NOT Reversinggg")
                        setBoard(data.newBoard)
                    }
                    else{
                        // console.log("Reversinggg")
                        data.newBoard.forEach((value, index) => {
                            value.reverse()
                        })
                        setBoard(data.newBoard.reverse())
                    }
                }
            })

            socket.on("gameOver", (data) => {
                let { winner } = data
                if (winner == side[0]) {
                    alert("Congratulation! You are the winner!")
                    navigate('/')
                }
                else {
                    alert("Unfortunate! You are the loser!")
                    navigate('/')
                }
            })


        }

    }, [socket])

    useEffect(()=>{
        let newPTurn = (pTurn == "R" ? "B" : "R");
        setPTurn(newPTurn)
    },[board])

    // useEffect(() => {
    //     if (time > 0)
    //         setTimeout(() => {
    //             if (time > 0) {
    //                 setTime(time - 1)
    //             }
    //         }, 1000)
    //     else {
    //         handleStartGame()
    //         setStarted(true)
    //     }
    // }, [time])

    async function handleStartGame(event) {
        event.preventDefault()
        let firstRow = board[0];
        // console.log("The first row being sent is " + firstRow)
        if (socket) {
            // if(side=="R"){
            //     firstRow = firstRow.reverse()
            // }
            socket.emit("setFirstBoard", { roomID: roomID, side: side, firstRow: firstRow })
        }

        event.target.disabled = true
    }




    async function handleGameClick(event) {
        if (pieces.current == null && start.current == null) {
            let position = String(event.target.id);
            if (side == "Blue") {
                position = String(4 - parseInt(position[0])) + String(parseInt(position[1]))
            }
            if (side == "Red") {
                position = String(4-parseInt(position[0])) + String(parseInt(position[1]))
            }
            start.current = [position[0], position[1]]
            pieces.current = board[position[0]][position[1]]
            if (pieces.current == null){
                return
            }

            // console.log("selected a piece at ",start)

            if (pieces.current[0] != side[0]) {
                alert("Cannot move other player's pieces!")
                start.current = null
                end.current = null
                pieces.current = null
                return

            }
            console.log(start.current)
            let x = [4-parseInt(start.current[0]), parseInt(start.current[1])]

            if (x ==null){
                return
            }
            let char = pieces.current.substring(pieces.current.indexOf('-') + 1);
            let limit = 0
            let sol = []



            if (char == "P") {
                limit = 1
                if (((x[0] + limit) > -1) && ((x[0] + limit) < 5)) {
                    sol.push([x[0] + limit, x[1]])
                }
                if (x[0] - limit > -1 && x[0] - limit < 5) {
                    sol.push([x[0] - limit, x[1]])
                }
                if (x[1] + limit > -1 && x[1] + limit < 5) {
                    sol.push([x[0], limit + x[1]])
                }
                if (x[1] - limit > -1 && x[1] - limit < 5) {
                    sol.push([x[0], x[1] - limit])
                }
            }
            if (char == "H1") {
                limit = 2
                if (((x[0] + limit) > -1) && ((x[0] + limit) < 5)) {
                    sol.push([x[0] + limit, x[1]])
                }
                if (x[0] - limit > -1 && x[0] - limit < 5) {
                    sol.push([x[0] - limit, x[1]])
                }
                if (x[1] + limit > -1 && x[1] + limit < 5) {
                    sol.push([x[0], limit + x[1]])
                }
                if (x[1] - limit > -1 && x[1] - limit < 5) {
                    sol.push([x[0], x[1] - limit])
                }
            }
            if (char == "H2") {
                limit = 2
                if (char == "H2") {
                    if ((x[0] + limit) > -1 && (x[0] + limit) < 5 && (x[1] + limit) > -1 && (x[1] + limit) < 5) {
                        sol.push([x[0] + limit, x[1] + limit])
                    }
                    if ((x[0] - limit) > -1 && (x[0] - limit) < 5 && (x[1] + limit) > -1 && (x[1] + limit) < 5) {
                        sol.push([x[0] - limit, x[1] + limit])
                    }
                    if ((x[0] + limit) > -1 && (x[0] + limit) < 5 && (x[1] - limit) > -1 && (x[1] - limit) < 5) {
                        sol.push([x[0] + limit, x[1] - limit])
                    }
                    if ((x[0] - limit) > -1 && (x[0] - limit) < 5 && (x[1] - limit) > -1 && (x[1] - limit) < 5) {
                        sol.push([x[0] - limit, x[1] - limit])
                    }
                }

            }


            var colorIndex = ""
            sol.map((value) => {
                colorIndex = String(value[0]) + String(value[1])
                if (side[0] == "R") {
                    document.getElementById(colorIndex).style.backgroundColor = "red"
                }
                else {
                    document.getElementById(colorIndex).style.backgroundColor = "blue"

                }
            })

            validMoves.current = sol;




        }
        else {
            let position = String(event.target.id);
            if (side == "Blue") {
                position = String(4-parseInt(position[0])) + String(parseInt(position[1]))
            }
            if (side == "Red") {
                position = String(4-parseInt(position[0])) + String(parseInt(position[1]))
            }
            console.log("moving selected piece to  ",start)
            let x = pieces.current;
            if (x ==null){
                return
            }
            if (x[0] == "B") {
                if (x[x.length - 1] == "P") {
                    if (position[1] == start.current[1]) {
                        if (Math.abs(position[0] - start.current[0]) == 1 && position[0] > -1 && position[0] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "B") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    let colorIndex = ''
                                    validMoves.current.map((value) => {
                                        colorIndex = String(value[0]) + String(value[1])
                                        document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                    })
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            let colorIndex = ''
                            validMoves.current.map((value) => {
                                colorIndex = String(value[0]) + String(value[1])
                                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                            })
                            return -1
                        }
                    }
                    else if (position[0] == start.current[0]) {
                        if (Math.abs(position[1] - start.current[1]) == 1 && position[1] > -1 && position[1] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "B") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    let colorIndex = ''
                                    validMoves.current.map((value) => {
                                        colorIndex = String(value[0]) + String(value[1])
                                        document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                    })
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            let colorIndex = ''
                            validMoves.current.map((value) => {
                                colorIndex = String(value[0]) + String(value[1])
                                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                            })
                            return -1
                        }
                    }
                    else {
                        alert("Invalid Move!!")
                        start.current = null
                        end.current = null
                        pieces.current = null
                        let colorIndex = ''
                        validMoves.current.map((value) => {
                            colorIndex = String(value[0]) + String(value[1])
                            document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                        })
                        return -1
                    }
                }
                if (x[x.length - 1] == "1") {
                    if (position[1] == start.current[1]) {
                        if (Math.abs(position[0] - start.current[0]) == 2 && position[0] > -1 && position[0] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "B") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    let colorIndex = ''
                                    validMoves.current.map((value) => {
                                        colorIndex = String(value[0]) + String(value[1])
                                        document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                    })
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            let colorIndex = ''
                            validMoves.current.map((value) => {
                                colorIndex = String(value[0]) + String(value[1])
                                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                            })
                            return -1
                        }
                    }
                    else if (position[0] == start.current[0]) {
                        if (Math.abs(position[1] - start.current[1]) == 2 && position[1] > -1 && position[1] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "B") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    let colorIndex = ''
                                    validMoves.current.map((value) => {
                                        colorIndex = String(value[0]) + String(value[1])
                                        document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                    })
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            let colorIndex = ''
                            validMoves.current.map((value) => {
                                colorIndex = String(value[0]) + String(value[1])
                                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                            })
                            return -1
                        }
                    }
                    else {
                        alert("Invalid Move!!")
                        start.current = null
                        end.current = null
                        pieces.current = null
                        let colorIndex = ''
                        validMoves.current.map((value) => {
                            colorIndex = String(value[0]) + String(value[1])
                            document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                        })
                        return -1
                    }
                }
                if (x[x.length - 1] == "2") {
                    if (position[1] == start.current[1] || position[0] == start.current[0]) {
                        alert("Invalid Move!!")
                        start.current = null
                        end.current = null
                        pieces.current = null
                        let colorIndex = ''
                        validMoves.current.map((value) => {
                            colorIndex = String(value[0]) + String(value[1])
                            document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                        })
                        return -1
                    }
                    else if (Math.abs(position[0] - start.current[0]) == 2 && Math.abs(position[1] - start.current[1]) == 2 && position[0] > -1 && position[0] < 5) {
                        let tempPiece = board[position[0]][position[1]]
                        if (tempPiece == null) {
                            end.current = ([position[0], position[1]])
                        }
                        else {
                            if (tempPiece[0] == "B") {
                                alert("Invalid Move!!")
                                start.current = null
                                end.current = null
                                pieces.current = null
                                let colorIndex = ''
                                validMoves.current.map((value) => {
                                    colorIndex = String(value[0]) + String(value[1])
                                    document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                })
                                return -1
                            }
                            else {
                                end.current = ([position[0], position[1]])
                            }
                        }
                    }
                    else {
                        alert("Invalid Move!!")
                        start.current = null
                        end.current = null
                        pieces.current = null
                        let colorIndex = ''
                        validMoves.current.map((value) => {
                            colorIndex = String(value[0]) + String(value[1])
                            document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                        })
                        return -1
                    }
                }
            }
            else if (x[0] == "R") {
                if (x[x.length - 1] == "P") {
                    if (position[1] == start.current[1]) {
                        if (Math.abs(position[0] - start.current[0]) == 1 && position[0] > -1 && position[0] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "R") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    let colorIndex = ''
                                    validMoves.current.map((value) => {
                                        colorIndex = String(value[0]) + String(value[1])
                                        document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                    })
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            let colorIndex = ''
                            validMoves.current.map((value) => {
                                colorIndex = String(value[0]) + String(value[1])
                                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                            })
                            return -1
                        }
                    }
                    else if (position[0] == start.current[0]) {
                        if (Math.abs(position[1] - start.current[1]) == 1 && position[1] > -1 && position[1] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "R") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    let colorIndex = ''
                                    validMoves.current.map((value) => {
                                        colorIndex = String(value[0]) + String(value[1])
                                        document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                    })
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            let colorIndex = ''
                            validMoves.current.map((value) => {
                                colorIndex = String(value[0]) + String(value[1])
                                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                            })
                            return -1
                        }
                    }
                    else {
                        alert("Invalid Move!!")
                        start.current = null
                        end.current = null
                        pieces.current = null
                        let colorIndex = ''
                        validMoves.current.map((value) => {
                            colorIndex = String(value[0]) + String(value[1])
                            document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                        })
                        return -1
                    }
                }
                if (x[x.length - 1] == "1") {
                    if (position[1] == start.current[1]) {
                        if (Math.abs(position[0] - start.current[0]) == 2 && position[0] > -1 && position[0] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "R") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    let colorIndex = ''
                                    validMoves.current.map((value) => {
                                        colorIndex = String(value[0]) + String(value[1])
                                        document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                                    })
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            let colorIndex = ''
                            validMoves.current.map((value) => {
                                colorIndex = String(value[0]) + String(value[1])
                                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
                            })
                            return -1
                        }
                    }
                    else if (position[0] == start.current[0]) {
                        if (Math.abs(position[1] - start.current[1]) == 2 && position[1] > -1 && position[1] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "R") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                        else {
                            alert("Invalid Move!!")
                            start.current = null
                            end.current = null
                            pieces.current = null
                            return -1
                        }
                    }
                    else {
                        alert("Invalid Move!!")
                        start.current = null
                        end.current = null
                        pieces.current = null
                        return -1
                    }
                }
                if (x[x.length - 1] == "2") {
                    if (position[1] == start.current[1] || position[0] == position[1]) {
                        alert("Invalid Move!!")
                        start.current = null
                        end.current = null
                        pieces.current = null
                        return -1
                    }
                    else {
                        if (Math.abs(position[0] - start.current[0]) == 2 && Math.abs(position[1] - start.current[1]) == 2 && position[0] > -1 && position[0] < 5) {
                            let tempPiece = board[position[0]][position[1]]
                            if (tempPiece == null) {
                                end.current = ([position[0], position[1]])
                            }
                            else {
                                if (tempPiece[0] == "R") {
                                    alert("Invalid Move!!")
                                    start.current = null
                                    end.current = null
                                    pieces.current = null
                                    return -1
                                }
                                else {
                                    end.current = ([position[0], position[1]])
                                }
                            }
                        }
                    }
                }
            }
            // console.log('Trying to move from      ', start.current, end.current, pieces.current, roomID)
            socket.emit('makeMove', { start: start.current, end: end.current, side: pieces.current[0], roomID: roomID, piece: pieces.current[pieces.current.length - 1] })
            end.current = null
            start.current = null
            pieces.current = null

            let colorIndex = ''
            validMoves.current.map((value) => {
                colorIndex = String(value[0]) + String(value[1])
                document.getElementById(colorIndex).style.backgroundColor = 'transparent';
            })


        }

    }

    function handleStartClick(event) {
        if (piece !== null) {
            let currPiece = event.target.innerHTML
            if (currPiece !=null){
                if (currPiece.at(-1)=="P"){
                    setPawn(pawn-1)
                }
                else if (currPiece.at(-1)=="1"){
                    setHero1(hero1-1)
                }
                else if (currPiece.at(-1)=="2"){
                    setHero2(hero2-1)
                }
            }
            event.target.innerHTML = `${piece.side}-${piece.kind}`
            let position = event.target.id;
            piece.position = [position[0], position[1]];
            // console.log(position,String(position)[0],String(position)[1])
            board[0][String(position)[1]] = `${piece.side}-${piece.kind}`
            setPiece(null)
        }
        else {
            let x = document.getElementById('heroChooser')

            x.style.borderWidth = '1px'
            x.style.borderStyle = 'solid'
            x.style.borderColor = 'red'
            setInterval(() => {
                x.style.borderWidth = '0px'
                x.style.borderStyle = 'none'
                x.style.borderColor = "white"
            }, 1000)

        }



    }

    function choosePiece(event) {
        if (event.target.innerHTML === "Pawn") {
            setPawn(pawn + 1)
            setPiece(new Pawn([0, 0], side))
        }
        else if (event.target.innerHTML === "Hero1") {
            if (hero1 == 1) {
                return
            }
            setPiece(new Hero1([0, 0], side))
            setHero1(hero1 + 1)
        }
        else {
            if (hero2 == 1) {
                return
            }
            setPiece(new Hero2([0, 0], side))
            setHero2(hero2 + 1)
        }
    }

    function handleLeaveGame(event){
        socket.emit('leavegame',{roomID:roomID})
        navigate('/')
    }

    return (
        <div className='boardContainer'>
            <h1 style={{ textAlign: 'center' }}> Currently Playing : {side}</h1>
            <div className='playerTurn' style={(!started) ? { display: "none" } : {}}>
                {console.log("pTurn and side is ", pTurn, side)}
                {(pTurn[0] == side[0]) ? <h2 style={{ color: 'green', textAlign: 'center' }}>Your Turn</h2> : <h2 style={{ color: 'red', textAlign: 'center' }}>Opponent's Turn</h2>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "500px" }}>
                <table className='boardBody'>
                    <tr className='boardRow' id="0s">
                        <td className='boardTile' id="00" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[4][0]}
                        </td>
                        <td className='boardTile' id="01" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[4][1]}
                        </td>
                        <td className='boardTile' id="02" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[4][2]}
                        </td>
                        <td className='boardTile' id="03" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[4][3]}
                        </td>
                        <td className='boardTile' id="04" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[4][4]}
                        </td>
                    </tr>
                    <tr className='boardRow' id="1s">
                        <td className='boardTile' id="10" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[3][0]}
                        </td>
                        <td className='boardTile' id="11" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[3][1]}
                        </td>
                        <td className='boardTile' id="12" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[3][2]}
                        </td>
                        <td className='boardTile' id="13" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[3][3]}
                        </td>
                        <td className='boardTile' id="14" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[3][4]}
                        </td>
                    </tr>
                    <tr className='boardRow' id="2s">
                        <td className='boardTile' id="20" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[2][0]}
                        </td>
                        <td className='boardTile' id="21" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[2][1]}
                        </td>
                        <td className='boardTile' id="22" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[2][2]}
                        </td>
                        <td className='boardTile' id="23" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[2][3]}
                        </td>
                        <td className='boardTile' id="24" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[2][4]}
                        </td>
                    </tr>
                    <tr className='boardRow' id="3s">
                        <td className='boardTile' id="30" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[1][0]}
                        </td>
                        <td className='boardTile' id="31" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[1][1]}
                        </td>
                        <td className='boardTile' id="32" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[1][2]}
                        </td>
                        <td className='boardTile' id="33" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[1][3]}
                        </td>
                        <td className='boardTile' id="34" onClick={(started && (pTurn==side[0])) ? handleGameClick : () => { alert("Not Your Move!")}}>
                            {board[1][4]}
                        </td>
                    </tr>
                    <tr className='boardRow' id="4s">
                        <td className='boardTile' id="40" onClick={(started) ? handleGameClick : handleStartClick}>
                            {board[0][0]}
                        </td>
                        <td className='boardTile' id="41" onClick={(started) ? handleGameClick : handleStartClick}>
                            {board[0][1]}
                        </td>
                        <td className='boardTile' id="42" onClick={(started) ? handleGameClick : handleStartClick}>
                            {board[0][2]}
                        </td>
                        <td className='boardTile' id="43" onClick={(started) ? handleGameClick : handleStartClick}>
                            {board[0][3]}
                        </td>
                        <td className='boardTile' id="44" onClick={(started) ? handleGameClick : handleStartClick}>
                            {board[0][4]}
                        </td>
                    </tr>
                </table>


            </div>
            <div className='pieceSelect' style={(started) ? { display: "none" } : {}}>
                <table id='heroChooser'>
                    <tr>
                        <td value="P" onClick={choosePiece}>
                            Pawn
                        </td>
                        <td value="H1" onClick={choosePiece}>
                            Hero1

                        </td>
                        <td value="H2" onClick={choosePiece}>
                            Hero2
                        </td>
                    </tr>
                </table>
                <br></br>
                <button onClick={handleStartGame} disabled={pCount >= 2 ? true : false}>
                    Start Game
                </button>
            </div>
                <button onClick={handleLeaveGame}>
                    Leave
                </button>

        </div>
    )
}
export default Board;