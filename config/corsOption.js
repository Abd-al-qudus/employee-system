const whitelist = [
    'www.front-end.com', 
    'http://127.0.0.1:3500',
    'https://www.google.com'
];
const corsOption = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

module.exports = corsOption;
