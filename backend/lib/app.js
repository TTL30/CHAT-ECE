const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http');
app.use(require('body-parser').json())
const microtime = require('microtime')
const routes = require('./routes');
var cookieParser = require('cookie-parser')
const opt = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT"],
  credentials: true
}

app.use(cors(opt), routes)
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
    allowedHeaders: ["ece-chat"]

  },    autoConnect: false
});

const { addUser,
  removeUser,
  getUser } = require('./utils/user');

const BOTCHAT = "ECE-BOT";


io.on('connect', (socket) => {
  console.log(socket.id)
  /* Join chat room  */
  socket.on('join', ({ username, room }, callback) => {
    /* add user to users list  */
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit('message', { author: BOTCHAT, content: `${user.username}, bienvenue sur  ${user.room} !`, channelId: room, creation: microtime.now() });
    socket.broadcast.to(user.room).emit('message', { author: BOTCHAT, content: `${user.username} a rejoins la conversation` });
    callback();
  });
  socket.on('leave', ({ username, room }, callback) => {
    removeUser(socket.id);
    socket.leave(room);

    /* handling with message, send message when user connect to a chat */
    io.to(room).emit('message', { author: BOTCHAT, content: `${username} a quitté la conversation.` });

    callback();
  });

  socket.on('chat message', (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      console.log("cestfind")
      io.to(user.room).emit('message', { author: user.username, content: message, channelId: user.room, creation: microtime.now() });
    }

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

