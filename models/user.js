const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const secretSchema = mongoose.Schema({
  secret: String,
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  secrets: [secretSchema],
  googleId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
