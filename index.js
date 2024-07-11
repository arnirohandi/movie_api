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

// Handle error in express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
