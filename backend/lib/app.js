const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http');
app.use(require('body-parser').json())
const microtime = require('microtime')
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const opt = {
  origin: "http://localhost:3000",
  credentials: true,
}

app.use(cors(opt), routes)
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["ece-chat"],

  }
});

const { addUser,
  removeUser,
  getUser, getUsersInRoom,addUser2,changeAvatar,getUserByUsername } = require('./utils/user');
const { json } = require('body-parser');

const BOTCHAT = "ECE-BOT";


io.on('connect', (socket) => {

  /* Join chat room  */
  socket.on('join', ({ username, room,email,avatar }, callback) => {
    /* add user to users list  */
    const { error, user } = addUser({ id: socket.id, username, room,email,avatar });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit('message', { author: BOTCHAT, content: `${user.username}, bienvenue sur  dans la conversation!`, channelId: room,  creation: Date.now(), email:"bot" });
    socket.broadcast.to(user.room).emit('message', { author: BOTCHAT, content: `${user.username} a rejoins la conversation` ,creation: Date.now(), email:"bot" });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    callback();
  });

  socket.on('check socket', ({username , room, email, avatar}, callback) => {
    const { error, user } = addUser2({ id: socket.id, username, room, email,avatar });
    if (error) {
      return callback(error);
    }
    if(user.room)
    {
      socket.join(user.room);
    }
    io.to(room).emit('roomData', { room: room, users: getUsersInRoom(room) });
  })


  socket.on('leave', ({ username, room }, callback) => {
    removeUser(socket.id);
    socket.leave(room);
    io.to(room).emit('roomData', { room: room, users: getUsersInRoom(room) });
    io.to(room).emit('message', { author: BOTCHAT, content: `${username} a quitté la conversation.`, creation: Date.now(), email:"bot" });
    callback();
  });

  socket.on('check room', ({username, room, avatar}, callback) => {
    console.log("mai " + username)
    changeAvatar(username, room, avatar)
    io.to(room).emit('roomData', { room: room, users: getUsersInRoom(room) });
    console.log("jai dans "  + JSON.stringify(getUsersInRoom(room)))
    callback();

  })

  socket.on('room deleted', ({room}, callback) => {
    io.to(room).emit('room del');
    callback()
  })

  socket.on('add to room', ({username}, callback) => {
    const user = getUserByUsername(username);
    if(user){
      console.log("jai " + JSON.parse(user))

    }else{
      console.log("no")
    }
    callback()
  })

  socket.on('chat message', (message, creation, email, callback) => {
    const user = getUser(socket.id);
    console.log("jai trouver " + JSON.stringify(user))
    if (user) {
      io.to(user.room).emit('message', { author: user.username, content: message, channelId: user.room, creation: creation, email:email, avatar:user.avatar });
    }else{
      console.log("je le trouve pas")
    }

    callback();
  });

  socket.on('delete message', ({room,message}, callback) => {
    socket.broadcast.to(room).emit('delete', {message});
    callback();
  });
  socket.on('update message', ({room,message, content}, callback) => {
    socket.broadcast.to(room).emit('update', {message, content});
    callback();
  });

  socket.on('disconect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      io.to(user.room).emit('message', { author: BOTCHAT, content: `${user.username} a quitté la conversation.` , channelId: user.room, creation: Date.now(), email:"bot"});
    }
  });

});

const config = {
  port: 5000
}

server.listen(config.port, () => {
  console.log(`Chat is waiting for you at http://localhost:${config.port}`)
})

