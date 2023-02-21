// Modules
const mongoose = require('mongoose'); // library for mongodb
const dotenv = require('dotenv'); // environment variables
// simplify the integration between Mongoose and Passport for local authentication
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

dotenv.config();

const url = process.env.MONGO_URL;
const key = process.env.SECRET;
const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

// strictQuery will become false in mongoose 7
mongoose.set('strictQuery', false);

// Connect to db
function connect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url, options)
      .then(() => {
        console.log('Connected to database..');
        // create schema
        const userSchema = mongoose.Schema({
          email: String,
          password: String,
          googleId: String,
          secret: String,
        });

        // add passport as a plugin to the schema
        userSchema.plugin(passportLocalMongoose);
        userSchema.plugin(findOrCreate);
        // create model
        const User = mongoose.model('users', userSchema);
        resolve(User);
      })
      .catch((e) => reject(e));
  });
}

module.exports = connect();
