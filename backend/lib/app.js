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
  credentials: true
}

app.use(cors(opt), routes)
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["ece-chat"]

  }
});

const { addUser,
  removeUser,
  getUser } = require('./utils/user');

const BOTCHAT = "ECE-BOT";


io.on('connect', (socket) => {

  /* Join chat room  */
  socket.on('join', ({ username, room, type }, callback) => {
    /* add user to users list  */
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    if(type === 1) {
      socket.broadcast.to(user.room).emit('message', { author: BOTCHAT, content: `${user.username} a rejoins la conversation` });
    }
    socket.emit('message', { author: BOTCHAT, content: `${user.username}, bienvenue sur  dans la conversation!`, channelId: room, creation: microtime.now() });

    socket.join(user.room);
    
    callback();
  });
  socket.on('leave', ({ username, room }, callback) => {
    removeUser(socket.id);
    socket.leave(room);

    /* handling with message, send message when user connect to a chat */
    io.to(room).emit('message', { author: BOTCHAT, content: `${username} a quitté la conversation.` });

    callback();
  });

  socket.on('chat message', (message, creation, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { author: user.username, content: message, channelId: user.room, creation: creation });
    }else{
      console.log("je le trouve pas")
    }

    callback();
  });

  socket.on('delete message', ({room,message}, callback) => {
    socket.broadcast.to(room).emit('delete', {message});
    callback();
  });

  socket.on('disconect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { author: BOTCHAT, content: `${user.username} a quitté la conversation.` , channelId: user.room, creation: microtime.now()});
    }
  });

});

const config = {
  port: 5000
}

server.listen(config.port, () => {
  console.log(`Chat is waiting for you at http://localhost:${config.port}`)
})

