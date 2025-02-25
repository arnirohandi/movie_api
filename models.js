/**
 * @fileoverview Defines MongoDB schemas for users and movies using Mongoose.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Mongoose schema for users.
 *
 * @typedef {Object} User
 * @property {string} Username - Unique username, required.
 * @property {string} Password - Hashed password, required.
 * @property {string} Email - User email, required.
 * @property {Date} Birthday - User's birth date.
 * @property {Array<ObjectId>} FavoriteMovies - List of user's favorite movies.
 */
let usersSchema = mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }]
});

/**
 * Hashes the user's password before saving it to the database.
 *
 * @param {string} password - Plain text password.
 * @returns {string} - Hashed password.
 */
usersSchema.statics.hashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Compares an entered password with the stored hashed password.
 *
 * @param {string} password - Plain text password.
 * @returns {boolean} - True if the password matches, otherwise false.
 */
usersSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Mongoose schema for movies.
 *
 * @typedef {Object} Movie
 * @property {string} title - Movie title, required.
 * @property {string} description - Movie description, required.
 * @property {Object} director - Director details.
 * @property {string} director.name - Director's name.
 * @property {string} director.bio - Director's biography.
 * @property {Date} director.birth_date - Director's birth date.
 * @property {string} director.death_year - Director's death year.
 * @property {Object} genre - Genre details.
 * @property {string} genre.name - Genre name.
 * @property {string} genre.description - Genre description.
 * @property {string} image_url - URL to movie image.
 * @property {boolean} featured - Whether the movie is featured.
 */
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
