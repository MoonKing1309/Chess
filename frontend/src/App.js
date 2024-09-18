import './App.css';
import Board from './components/board';
import Room from './components/room';
import Loading from './components/loading'
import {useEffect, useState } from 'react'
import io from 'socket.io-client';
// import SocketContext from './socket'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


// const socket = io("http://localhost:5001")


function App() {
  const [roomID,setRoomID] = useState(null)
  const [side,setSide] = useState(null)
  const [socket,setSocket] = useState(null)
  const [pCount,setPCount] = useState(0)
  const [pTurn,setPTurn] = useState("B")
  const [allRooms,setAllRooms] = useState([])

  async function connect(){
    const tempSocket = await io.connect("http://localhost:5001")
    tempSocket.on('getAllRooms',(data)=>{
      console.log('allrooms is ',data)
      setAllRooms(Array.from(data.data))
    })
    setSocket(tempSocket)
  }

  useEffect(()=>{
    connect()
    // console.log('socket is ' ,socket);
    return () => {
      socket.disconnect();
    };
  },[])
 

  return (
    <div className='container'>
      {/* <Board/> */}
      {/* <Room/>  */}

      <Router>
        <Routes>
          <Route path='/' element={(socket)?<Room roomID={[roomID, setRoomID]}  side={[side,setSide]} socket={socket} pCount={[pCount,setPCount]} pTurn={[pTurn,setPTurn]} allRooms = {allRooms}/>:<Loading/>}></Route>
          <Route path='/game' element={(socket)?<Board roomID={[roomID, setRoomID]} side={[side,setSide]} socket={socket} pCount = {[pCount,setPCount]} pTurn={[pTurn,setPTurn]}/>:<Loading/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
