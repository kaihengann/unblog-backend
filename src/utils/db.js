const mongoose = require('mongoose');

const mongoOptions = {
  useNewUrlParser: true,
};

const dbUrl = global.__MONGO_URI__ || 'mongodb://localhost:27017/unblog';
mongoose.connect(dbUrl, mongoOptions);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to mongodb');
});
