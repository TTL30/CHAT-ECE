/* List users */  
const users = [];

/*Add user to list if is not already in a chat */
const addUser = ({ id, username, room, email, avatar }) => {
  /* Handling with capitalcase in pseudo */ 
  username = username.trim().toLowerCase();
  const user = { id, username, room , email, avatar};
  const alreadyIn = users.find((user) => user.room === room && user.username === username)
  if(alreadyIn){
    users.splice(users.indexOf(alreadyIn))
    users.push(user);
    return { user }
  }
  users.push(user);
  return { user }
}

const addUser2 = ({ id, username, room, email, avatar }) => {
  /* Handling with capitalcase in pseudo */ 
  username = username.trim().toLowerCase();
  let user = { id, username, room, email};
  const alreadyIn = users.find((user) => user.room === room && user.username === username)
  if(alreadyIn){
    if(user.id !== alreadyIn.id)
    {
      const ind = users.findIndex((user) => user === alreadyIn)
      users[ind].id = user.id
      return { user }
    }

    user = alreadyIn
    return { user }
  }
  return { user }
}

const changeAvatar = (username, room, avatar) => {
  const alreadyIn = users.find((user) => user.room === room && user.username === username)
  if(alreadyIn){
    const ind = users.findIndex((user) => user === alreadyIn)
    users[ind].avatar = avatar
  }
}
/* get user with id */ 
const getUser = (id) => {
  
  const user = users.find((user) => user.id === id);
  return user 
}

/* const findUserByUser = (username) => users.find((user) => user.username === username);
 *//* Remove User from list */ 
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if(index !== -1){
    return users.splice(index, 1)[0];
  }
}

const getUsersInRoom = (room) =>{
  const mesUsers = users.filter((user) => user.room === room)
  return mesUsers
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addUser2,
  changeAvatar
};