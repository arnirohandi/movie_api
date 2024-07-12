// Require the express module
const express = require('express');
const morgan = require('morgan');

// Create an instance of express
const app = express();

let topMovies = [
  { title: 'The Dark Knight', director: 'Christopher Nolan', year: 2008 },
  { title: 'Inception', director: 'Christopher Nolan', year: 2010 },
  { title: 'The Lord of the Rings: The Return of the King', director: 'Peter Jackson', year: 2003 },
  { title: 'Mad Max: Fury Road', director: 'George Miller', year: 2015 },
  { title: 'Parasite', director: 'Bong Joon-ho', year: 2019 },
  { title: 'The Social Network', director: 'David Fincher', year: 2010 },
  { title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
  { title: 'The Wolf of Wall Street', director: 'Martin Scorsese', year: 2013 },
  { title: 'Spider-Man: Into the Spider-Verse', director: 'Peter Ramsey, Rodney Rothman', year: 2018 },
  { title: 'Everything Everywhere All at Once', director: 'Daniel Kwan, Daniel Scheinert', year: 2022 }
];

// Use morgan middleware
app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});


// New Routes

// Endpoint to get a single movie by title
app.get('/movies/title/:title', (req, res) => {
  const { title } = req.params;
  res.send(`Return data about the movie titled: ${title}`);
});

// Endpoint to get a genre by name/title
app.get('/genres/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Return data about the genre: ${name}`);
});

// Endpoint to get a director by name
app.get('/directors/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Return data about the director: ${name}`);
});

// Endpoint to register a new user
app.post('/users', (req, res) => {
  res.send('Register a new user');
});

// Endpoint to update user info
app.put('/users/:username', (req, res) => {
  const { username } = req.params;
  res.send(`Update user info for username: ${username}`);
});

// Endpoint to add a movie to user's favorites
app.post('/users/:username/favorites/:movieId', (req, res) => {
  const { username, movieId } = req.params;
  res.send(`Add movie with ID ${movieId} to favorites for user: ${username}`);
});

// Endpoint to remove a movie from user's favorites
app.delete('/users/:username/favorites/:movieId', (req, res) => {
  const { username, movieId } = req.params;
  res.send(`Remove movie with ID ${movieId} from favorites for user: ${username}`);
});

// Endpoint to deregister a user
app.delete('/users/:username', (req, res) => {
  const { username } = req.params;
  res.send(`Deregister user with username: ${username}`);
});

// Handle error in express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
