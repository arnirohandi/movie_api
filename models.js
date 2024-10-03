const mongoose = require('mongoose');

let moviesSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Director: {
    Name: String,
    Bio: String,
    Birth_date: Date,
    Death_year: String
  },
  Genre: {
    Name: String,
    Description: String
  },
  Image_url: String,
  Featured: Boolean
});

let usersSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }]
});

let Movies = mongoose.model('Movies', moviesSchema);
let Users = mongoose.model('Users', usersSchema);

module.exports.Movies = Movies;
module.exports.Users = Users;