const db = require('./db')
const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http');
app.use(require('body-parser').json())
const microtime = require('microtime')

const opt = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true
}

app.use(cors(opt))
const server = http.createServer(app);
 const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
    allowedHeaders: ["ece-chat"]

  }
});
const { addUser,
  removeUser, 
  getUser } = require('./utils/user');
const BOTCHAT = "ECE-BOT"


io.on('connect', (socket) => {
  console.log(socket.id)
  /* Join chat room  */
  socket.on('join', ({ username, room }, callback) => {
    /* add user to users list  */
    const { error, user } = addUser({id: socket.id, username, room});
    if(error){
      return callback(error);
    }
    socket.join(user.room);
    socket.emit('message', { author: BOTCHAT, content: `${user.username}, bienvenue sur  ${user.room} !`, channelId:room, creation:microtime.now()  });
    socket.broadcast.to(user.room).emit('message', { author: BOTCHAT, content: `${user.username} a rejoins la conversation`});
    callback();
  });
  socket.on('leave', ({username,room }, callback) => {
    removeUser(socket.id);
    socket.leave(room);

    /* handling with message, send message when user connect to a chat */
    io.to(room).emit('message', { author: BOTCHAT, content: `${username} a quitté la conversation.` });

    callback();
  });

  socket.on('chat message', (message, callback) => {
    console.log("oui " + socket.id)
    const user = getUser(socket.id);
    if(user){
      console.log("cestfind")
      io.to(user.room).emit('message', { author: user.username, content: message, channelId:user.room, creation:microtime.now()});
    }

    callback();
  });

  socket.on('disconect', () => {
    const user = removeUser(socket.id);

    if(user){
      io.to(user.room).emit('message', { author: BOTCHAT, content: `${user.name} a quitté la conversation.` });
    }
  });

});



app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
})

// Channels

app.get('/channels', async (req, res) => {
  const channels = await db.channels.list()
  res.json(channels)
})

app.post('/channels', async (req, res) => {
  const channel = await db.channels.create(req.body)
  res.status(201).json(channel)
})

app.post('/:id/channels', async (req, res) => {
  console.log(req.params.id)
  console.log(req.body)

  const channel = await db.channels.create_user_channel(req.params.id,req.body)
  res.status(201).json(channel)
})


app.put('/channels/users/:id', async (req, res) => {
  const user = await db.users.add_channel_to_user(req.params.id,req.body)
  if(user === "No user with this username")res.status(404).json(user)
  else res.status(201).json(user)
})

app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id)
  res.json(channel)
})

app.put('/channels/:id', async (req, res) => {
  const channel = await db.channels.update(req.params.id,req.body)
  res.json(channel)
})

app.delete('/channels/:id', async (req, res) => {
  const channel = await db.channels.delete(req.params.id)
  res.json(channel)
})

// Messages

app.get('/channels/:id/messages', async (req, res) => {
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
})

app.post('/channels/:id/messages', async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body)
  res.status(201).json(message)
})

// Users

app.get('/users', async (req, res) => {
  const users = await db.users.list()
  res.json(users)
})

app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body)
  if(user === "Username/email already used")res.status(404).json(user)
  else res.status(201).json(user)
})

app.post('/login', async (req, res) => {
  const user = await db.users.login(req.body)
  if(user === "Wrong combination username/password")res.status(404).json(user)
  else res.status(201).json(user)
})


app.get('/users/:id', async (req, res) => {
  const user = await db.users.get(req.params.id)
  res.json(user)
})

app.put('/users/:id', async (req, res) => {
  const user = await db.users.update(req.body)
  res.json(user)
})

app.delete('/users/:id', async (req, res) => {
  const user = await db.users.delete(req.params.id)
  res.json(user)
})

app.get('/:id/userchannels', async (req, res) => {
  const channel = await db.users.listChannels(req.params.id)
  res.status(201).json(channel)
})


const config = {
  port: 5000
}

server.listen(config.port, () => {
  console.log(`Chat is waiting for you at http://localhost:${config.port}`)
})
