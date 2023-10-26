const router = require('./routes/index');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const corsOption = require('./config/corsOption');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

const server = express();

// env variables config
dotenv.config();

//cookie parser
server.use(cookieParser());

//server custom middleware
server.use(logger);

//handle credential checks
server.use(credentials);

// protect all routes with jwt
server.use(verifyJWT);

//route handling
server.use(router);
 
// cors configuration
server.use(cors(corsOption));

//server configuration
server.use(express.json());
server.use(express.urlencoded({ extended: false }));


server.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

