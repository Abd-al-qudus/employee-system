const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (credentials) { this.users = credentials }
}

const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fsPromises = require('fs').promises;

dotenv.config();

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password){
    res.status(400).json({ message: 'invalid username or password' });
  }
  if (typeof username !== "string" || typeof password !== "string"){
    res.status(400).json({ message: 'username or password must be string' });
  }
  const user = usersDB.users.find((user) => user.username === username);
  if (!user) res.status(404).json({ message: 'user does not exist' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.sendStatus(401).json('incorrect password');
  }
  const accessToken = jwt.sign(
    { "username": user.username },
    process.env.ACCESS_TOKEN,
    { expiresIn: "30s" }
  );
  const refreshToken = jwt.sign(
    { "username": user.username },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1d" }
  );

  const otherUsers = usersDB.users.filter((person) => person.username !== user.username);
  const currentUser = { ...user, refreshToken };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'models', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 3600 * 1000 });
  res.json({ accessToken });
}

const logOutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt){
    res.sendStatus(204);
  }
  const refreshTok = cookies.jwt;
  const user = usersDB.users.find((user) => user.refreshToken === refreshTok);
  if (!user) {
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 3600 * 1000, sameSite:'None', secure: true });
    return res.sendStatus(204);
  }
  const otherUsers = usersDB.users.filter((user) => user.refreshToken !== refreshTok);
  const currentUser = {...user, refreshToken: ''}; 
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'models', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 3600 * 1000, sameSite: 'None', secure: true });
  res.sendStatus(204);
}

module.exports = { loginUser, logOutUser };
