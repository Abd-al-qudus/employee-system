const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (credentials) { this.users = credentials }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const createNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password){
    res.status(400).json({ message: 'invalid username or password' });
  }
  if (typeof username !== "string" || typeof password !== "string"){
    res.status(400).json({ message: 'username or password must be string' });
  }
  const duplicateUser = usersDB.users.find((user) => user.username === username);
  if (duplicateUser) res.status(409).json({ message: 'user exist' });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword
    }
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'users.json'),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ message: `user ${username} created`});
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
}

module.exports = { createNewUser };
