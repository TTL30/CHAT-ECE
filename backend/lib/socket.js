const io = require('./app')

/* Connection with socket io  */
io.on('connect', (socket) => {
    console.log("dzez")
  
    /* Join chat room  */
    socket.on('join', ({ pseudo, room }, callback) => {
  
      /* add user to users list  */
      const { error, user } = addUser({id: socket.id, pseudo, room});
  
      if(error){
        return callback(error);
      }
      
      /* user join room */
      socket.join(user.room);
      join(pseudo, room)
  
      /* handling with message, send message when user connect to a chat */
      socket.emit('message', { user: BOTCHAT, text: `${user.pseudo}, bienvenue sur  ${user.room} !`});
      socket.broadcast.to(user.room).emit('message', { user: BOTCHAT, text: `${user.pseudo} a rejoins la conversation`});
  
      callback();
    });
    socket.on('leave', ({ room }, callback) => {
  
      /* add user to users list  */
      //const userR = removeUser(socket.id);
      socket.leave(room);
  
  
  
      /* handling with message, send message when user connect to a chat */
      io.to(room).emit('message', { user: BOTCHAT, text: ` a quitté la conversation.` });
  
      callback();
    });
  
    /* handling with message, sending message */ 
    socket.on('chat message', (message, callback) => {
      const user = getUser(socket.id);
      if(user){
        io.to(user.room).emit('message', { user: user.pseudo, text: message});
      }
  
      callback();
    });
  
    /* user disconect */ 
    socket.on('disconect', () => {
      const user = removeUser(socket.id);
  
      if(user){
        io.to(user.room).emit('message', { user: BOTCHAT, text: `${user.name} a quitté la conversation.` });
      }
    });
  });