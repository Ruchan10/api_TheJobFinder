const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
// Add the remove function to the schema
userSchema.methods.remove = function () {
    return this.deleteOne();
  };

const User = mongoose.model('User', userSchema);

module.exports = User;
