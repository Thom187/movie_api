const mongoose = require ('mongoose');
const bcrypt = require('bcrypt'); // Import module bcrypt to hash user passwords

let movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre: {
    name: String,
    description: String
  },
  director: {
    name: String,
    description: String
  },
  actors: [String],
  imagePath: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}; // hashes submitted passwords

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}; // compares submitted hashed passwords with existing ones

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
