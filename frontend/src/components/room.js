import './styles/room.css'
// import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom'
// const socket = io.connect("http://localhost:5001");

// import { socketID, socket } from '../socket';


function Room(props) {
    const roomID = props.roomID[0]
    const setRoomID = props.roomID[1]
    const side = props.side[0];
    const setSide = props.side[1];  
    const socket = props.socket;
    const pCount = props.pCount[0];
    const setPCount = props.pCount[1];
    const pTurn = props.pTurn[0];
    const setPTurn = props.pTurn[1];
    const navigate = useNavigate();


    const allRooms = props.allRooms;
    

    async function sendRoomId(event){
        event.preventDefault()
        // console.log("jere")
        // var room = io.sockets.adapter.rooms['roomId'];
        // prompt(io)
        
        socket.emit("joinRoom",{roomID})
    }

    useEffect(()=>{
        // console.log(socket)
        if (socket){
            let stateVariable = {socket:socket,roomID:roomID,side:side}
            socket.on('waitingForOtherPlayer',(data)=>{
                setRoomID(data.roomId)
                setSide(data.side)
                setPCount(data.pCount)
                // console.log("data 1 is " + data.data)
                navigate(`/game`);
                
            })
            socket.on('letsPlay',(data)=>{
                // console.log("data 2 is " + data)
                navigate(`/game`);
            })
            socket.on('roomFullError',(data)=>{
                console.log("roomFullError" + data.data)
                alert(`${data.data}`)
            })

            // socket.on("getAllRooms",(data)=>{
            //     setAllRooms(data)
            // })
        }

    },[socket])

    // useEffect(()=>{
    //     if(!allRooms){
    //         console.log("sad")
    //     }
    // },[allRooms])
    
    // function printAllRooms(){
    //     let sol = []
    //     allRooms.forEach((value,index) => {
    //         let rName= value[0]
    //         let rID = value[1]
    //         sol.push(
    //             <>
    //              <tr>
    //                 <td>{index+1}</td>
    //                 <td>{rName}</td>
    //                 <td><button onClick={()=>{
                        
    //                 }}>Join</button></td>
    //             </tr>
    //             </>
    //            )
    //        })
    //        return sol
    // }
    function noTable(){
        return(
            <>
                <tr style={{textAlign:'center'}}>
                    <td colSpan={3}>
                         No Rooms Available
                    </td>
                </tr>
            </>
        )
    }
    return (
        <div className='roomContainer'>
            <div className='roomLeft'>
                {/* <h2>Enter your RoomID</h2> */}
                <form>
                    <label>
                        <h1>Enter a Room ID</h1>
                    </label>
                    <input type='text' name='roomId' onChange={(event)=>{
                        setRoomID(event.target.value)
                    }}></input>
                </form>
                <div className='break'></div>
                <button onClick={sendRoomId}>Submit</button> {/* make it look pretty*/}


            </div>

            <div className='roomRight' style={(allRooms==undefined)?{display:"none"}:{}}>
                <h2>Join Existing Rooms</h2>
                    <table>
                        <tr>
                            <th>Index</th>
                            <th>RoomID</th>
                            <th>Action</th>
                        </tr>
                    {(allRooms.length!=0)?(allRooms.map((value,index) => {
                            // console.log(value,index)
                            let rName= value
                            return (<>
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{rName}</td>
                                    <td><button onClick={()=>{
                                        socket.emit('joinRoom',{rName})
                                    }}>Join</button></td>
                                </tr>
                            </>
                                )
                           })):(
                               noTable()
                            //    return <tr aria-colspan={3}>
                            //        No Tables
                            //    </tr>



                           )
                    }
                    </table>
            </div>

        </div>
    )
}

export default Room;