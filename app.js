require("dotenv").config(); //tempatkan dotenv paling awal
//console.log(process.env.PORT);
const socketIO = require('socket.io');
const cors = require("cors"); //cors untuk localstorage
const express = require("express");
const app = express();
const router = require('./routes')
const port = process.env.PORT || 3000; 

const errorHandler = require("./middlewares/errorHandler");


app.use(cors()); //memfilter akses. jika dalam kurung kosong, semua bisa masuk
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const {createServer} = require('http')
const {Server, Socket}  = require('socket.io')
const httpServer = createServer(app)
const INDEX = '/index.html';
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(port, () => console.log(`Listening on ${port}`));
const io = socketIO(server)

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

// httpServer.listen(process.env.PORT||5000, ()=> {
//   console.log(`Socket Listening to port 5000`)
// })


app.use('/', router)
//test


app.use(errorHandler);


// app.listen(port, () => {
//   console.log(`Listening to port ${port}!`);
// });

module.exports = app