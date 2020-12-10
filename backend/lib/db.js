
const { v4: uuid } = require('uuid')
const { clone, merge } = require('mixme')
const microtime = require('microtime')
const level = require('level')
const db = level(__dirname + '/../db')


module.exports = {
  channels: {
    create: async (channel) => {
      if (!channel.name) throw Error('Invalid channel')
      const id = uuid()
      await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, { id: id })
    },
    create_user_channel: async (id_user, channel) => {
      if (!channel.name) throw Error('Invalid channel')
      const id = uuid()
      await db.put(`channels:${id}`, JSON.stringify({
        id_cre: id_user,
        name: channel.name
      }))
      const data = await db.get(`users:${id_user}`)
      if (!data) throw Error('Unregistered user id')
      const chan = JSON.parse(data).channels
      chan.push(id)
      await db.put(`users:${id_user}`, JSON.stringify({
        username: JSON.parse(data).username,
        email: JSON.parse(data).email,
        password: JSON.parse(data).password,
        channels: chan
      }))
      return merge(channel, { id: id })
    },
    get: async (id) => {
      if (!id) throw Error('Invalid id')
      const data = await db.get(`channels:${id}`)
      const channel = JSON.parse(data)
      return merge(channel, { id: id })
    },
    list: async () => {
      return new Promise((resolve, reject) => {
        const channels = []
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          channel = JSON.parse(value)
          channel.id = key.split(':')[1]
          channels.push(channel)
        }).on('error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(channels)
        })
      })
    },
    update: async (id, channel) => {
      const original = await db.get(`channels:${id}`)
      if (!original) throw Error('Unregistered channel id')
      await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(original, channel)
    },
    delete: async (id) => {
      const original = await db.get(`channels:${id}`)
      if (!original) throw Error('Unregistered channel id')
      await db.del(`channels:${id}`)
    }
  },
  messages: {
    create: async (channelId, message) => {
      if (!channelId) throw Error('Invalid channel')
      if (!message.author) throw Error('Invalid message')
      if (!message.content) throw Error('Invalid message')
      creation = microtime.now()
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content
      }))
      return merge(message, { channelId: channelId, creation: creation })
    },
    list: async (channelId) => {
      return new Promise((resolve, reject) => {
        const messages = []
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          message = JSON.parse(value)
          const [, channelId, creation] = key.split(':')
          message.channelId = channelId
          message.creation = creation
          messages.push(message)
        }).on('error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(messages)
        })
      })
    },
  },
  users: {
  
    create: async (myUser) => {
      return new Promise((resolve, reject) => {

        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on('error', (err) => {
          reject(err)
        }).on('end', (err) => {
          users.some((e, index) => {
            if (myUser.username === e.username || myUser.email === e.email) {
              resolve("Username/email already used")
              return true
            } if (index + 1 === users.length) {
              const id = uuid()
              db.put(`users:${id}`, JSON.stringify(myUser))
              resolve(e)
            }
          })
        })
      })
    },

    login: async (myUser) => {
      return new Promise((resolve, reject) => {

        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on('error', (err) => {
          reject(err)
        }).on('end', (err) => {
          users.some((e, index) => {
            if (myUser.username === e.username && myUser.password === e.password) {
              resolve(e)
              return true
            } if (index + 1 === users.length) {
              resolve("Wrong combination username/password")
            }
          })
        })
      })
    },
    listChannels: async (id) => {
      if (!id) throw Error('Invalid id')
      const data = await db.get(`users:${id}`)
      const channel = JSON.parse(data).channels
      return channel
    },
    get: async (id) => {
      if (!id) throw Error('Invalid id')
      const data = await db.get(`users:${id}`)
      const user = JSON.parse(data)
      return merge(user, { id: id })
    },
    list: async () => {
      return new Promise((resolve, reject) => {
        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on('error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(users)
        })
      })
    },
    add_channel_to_user: async (id, myUser) => {
      return new Promise((resolve, reject) => {
        console.log("jai + " + myUser.username )
        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on('error', (err) => {
          reject(err)
        }).on('end', (err) => {
          users.some((e, index) => {
            if(myUser.username === e.username) {
              const chan = e.channels
              chan.push(id)
              db.put(`users:${e.id}`, JSON.stringify({
                username: e.username,
                email:e.email,
                password: e.password,
                channels: chan
              }))
              resolve("user added to channel ")
              return true
            } if (index + 1 === users.length) {
              resolve("No user with this username")
            }
          })
        })
      });
    }
    /* add_channel_to_user: async (id, username) => {
      const data = await db.get(`users:${id}`)
      if (!data) throw Error('Unregistered user id')
      const chan = JSON.parse(data).channels
      chan.push(id_ch)
      await db.put(`users:${id}`, JSON.stringify({
        username: JSON.parse(data).username,
        email: JSON.parse(data).email,
        password: JSON.parse(data).password,
        channels: chan
      }))
    } */,
    update: (id, user) => {
      const original = store.users[id]
      if (!original) throw Error('Unregistered user id')
      store.users[id] = merge(original, user)
    },
    delete: async (id) => {
      const original = await db.get(`users:${id}`)
      if (!original) throw Error('Unregistered user id')
      await db.del(`users:${id}`)
    }
  },
  admin: {
    clear: async () => {
      await db.clear()
    }
  }
}
