const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let usersSchema = mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  BaseAudioContextirthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }]
});

// Hash password before saving to the database
usersSchema.statics.hashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Compare entered password with hashed password in the database
usersSchema.method.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let moviesSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
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

let Users = mongoose.model('Users', usersSchema);
let Movies = mongoose.model('Movies', moviesSchema);

module.exports = {
    Users: Users,
    Movies: Movies
};