const mongoose = require('mongoose');

let moviesSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  director: {
    name: String,
    bio: String,
    birth_date: Date,
    death_year: String
  },
  genre: {
    name: String,
    description: String
  },
  image_url: String,
  featured: Boolean
});

let usersSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }]
});

let Movies = mongoose.model('Movies', moviesSchema);
let Users = mongoose.model('Users', usersSchema);

module.exports.Movies = Movies;
module.exports.Users = Users;