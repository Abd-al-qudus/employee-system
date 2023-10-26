const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (credentials) { this.users = credentials }
}
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
  
dotenv.config();
  
const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt){
      return res.sendStatus(401);
    }
    const refreshTok = cookies.jwt;
    const user = usersDB.users.find((user) => user.refreshToken === refreshTok);
    if (!user) res.sendStatus(403);
    
    jwt.verify(
      refreshTok,
      process.env.REFRESH_TOKEN,
      (error, decoded) => {
        if (error || user.username !== decoded.username) return res.sendStatus(403);
        const accessToken = jwt.sign(
          { "username": decoded.username },
          process.env.ACCESS_TOKEN,
          { expiresIn: "30s" }
        );
        res.json({ accessToken });
      }
    )
  }

module.exports = { handleRefreshToken };
  