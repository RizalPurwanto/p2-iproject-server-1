const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    let arrUsers = []
    let arrChats = []
    
    io.on("connection", (socket) => {
    
      console.log("A USER IS CONECTED", socket.id)
      console.log(socket.rooms, "INI SOCKET ROOMS")
    
    
      socket.on("disconnect", ()=>{
        console.log("A USER HAS DISCONECTED")
      })
    
      socket.on("customEventFromClient", (payload)=>{
        console.log("RECEIVE PAYLOAD", payload)
      })
    
      
    //v-on this$emit
      socket.emit("customEventFromServer", "FROM SERVER")
    
      socket.on("setUsername", (payload) => {
        arrUsers.push({
          username: payload,
          status: "online"
        })
        console.log(arrUsers, " INI ARR USERS")
      })
    
      
    
      socket.on("sendMessageToServer", (payload) => {
        if(payload.message) {
          arrChats.push(payload)
        }
        
        socket.join(payload.room);
        console.log(arrChats, " INI ARR CHATS")
        const filtered = arrChats.filter(el => {
          return el.room == payload.room
        })
        io.to(payload.room).emit("messagesFromServer", filtered)
        
        
        
      })
    })
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);