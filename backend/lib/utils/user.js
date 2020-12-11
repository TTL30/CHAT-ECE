/* List users */  
const users = [];

/*Add user to list if is not already in a chat */
const addUser = ({ id, username, room }) => {
    console.log("jadd " + id)
  /* Handling with capitalcase in pseudo */ 
  username = username.trim().toLowerCase();
  const user = { id, username, room };
  const alreadyIn = users.find((user) => user.room === room && user.username === username)

  /* if(alreadyIn){
    console.log("deja la")
    return{ error: 'Vous êtes déjà dans le chat dans un autre onglet !' };
  } */
  console.log("la ")

  users.push(user);
  return { user }
}

/* get user with id */ 

/* const findUserByUser = (username) => users.find((user) => user.username === username);
 *//* Remove User from list */ 
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if(index !== -1){
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  findUserByUser
};