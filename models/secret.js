const mongoose = require('mongoose');

const secretSchema = mongoose.Schema({
  secret: String,
});

module.exports = mongoose.model('Secret', secretSchema);
