
const routes = require('express').Router();
const db = require('./db')

routes.get('/', (req, res) => {
    res.send([
      '<h1>ECE DevOps Chat</h1>'
    ].join(''))
  })
  
  // Channels
  
  routes.get('/channels', async (req, res) => {
    const channels = await db.channels.list()
    res.json(channels)
  })
  
  routes.post('/channels', async (req, res) => {
    const channel = await db.channels.create(req.body)
    res.status(201).json(channel)
  })
  
  routes.post('/:id/channels', async (req, res) => {  
    const channel = await db.channels.create_user_channel(req.params.id,req.body)
    res.status(201).json(channel)
  })
  
  
  routes.put('/channels/users/:id', async (req, res) => {
    const user = await db.users.add_channel_to_user(req.params.id,req.body)
    if(user === "No user with this username" || user === "User is already in this channel")res.status(404).json(user)
    else res.status(201).json(user)
  })
  
  routes.get('/channels/:id', async (req, res) => {
    const channel = await db.channels.get(req.params.id)
    res.json(channel)
  })
  
  routes.put('/channels/:id', async (req, res) => {
    const channel = await db.channels.update(req.params.id,req.body)
    res.json(channel)
  })
  
  routes.delete('/channels/:id', async (req, res) => {
    const channel = await db.channels.delete(req.params.id)
    res.status(201).json(channel)
  })
  
  // Messages
  
  routes.get('/channels/:id/messages', async (req, res) => {
    const messages = await db.messages.list(req.params.id)
    res.json(messages)
  })
  
  routes.post('/channels/:id/messages', async (req, res) => {
    const message = await db.messages.create(req.params.id, req.body)
    res.status(201).json(message)
  })
  routes.delete('/channels/:id/messages/:id_m', async (req, res) => {
    const message = await db.messages.delete(req.params.id_m, req.params.id)
    res.status(201).json(message)
  })
  
  // Users
  
  routes.get('/users', async (req, res) => {
    const users = await db.users.list()
    res.json(users)
  })
  
  routes.post('/users', async (req, res) => {
    const user = await db.users.create(req.body)
    if(user === "Username/email already used")res.status(404).json(user)
    else res.status(201).json(user)
  })
  
  routes.post('/login', async (req, res) => {
    const user = await db.users.login(req.body)
    if(user === "Wrong combination username/password" || user === "No account register first")res.status(404).json(user)
    else res.status(201).json(user)
  })
  
  
  routes.get('/users/:id', async (req, res) => {
    const user = await db.users.get(req.params.id)
    res.json(user)
  })
  
  routes.put('/users/:id', async (req, res) => {
    const user = await db.users.update(req.body)
    res.json(user)
  })
  
  routes.delete('/users/:id', async (req, res) => {
    const user = await db.users.delete(req.params.id)
    res.json(user)
  })
  
  routes.get('/:id/userchannels', async (req, res) => {
    const channel = await db.users.listChannels(req.params.id)
    res.status(201).json(channel)
  })
  
  module.exports = routes;