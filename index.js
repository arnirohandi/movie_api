// Require module
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const app = express();
const MongoMovies = Models.Movies;
const MongoUsers = Models.Users;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cfDB',{ })
  .then(() => console.log('This application server is now connected to MongoDB server'))
  .catch(err => console.error('Could not connect to MongoDB server:', err));

// Use middleware
app.use(express.json()); // Parsing JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all domains
app.use(morgan('common')); // Use morgan for logging

// Import auth.js file
let auth = require('./auth')(app);

// Import and configure passport.js file
require('./passport');

// Validation rules for user registration
const userValidationRules = [
  check('Username', 'Username is required and must be at least 5 characters long').isLength({ min: 5 }),
  check('Username', 'Username must contain only alphanumeric characters.').isAlphanumeric(),
  check('Password', 'Password is required.').not().isEmpty(),
  check('Email', 'Email must be a valid email address.').isEmail()
];

const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

let directors = [
  {
    "name": "Christopher Nolan",
    "bio": "British-American filmmaker known for his distinctive storytelling and visually innovative films such as 'Inception', 'The Dark Knight Trilogy', and 'Dunkirk'.",
    "birthYear": 1970,
    "deathYear": null
  },
  {
    "name": "Bong Joon-ho",
    "bio": "South Korean filmmaker acclaimed for his socially conscious and genre-blending films, including 'Parasite', 'Snowpiercer', and 'Memories of Murder'.",
    "birthYear": 1969,
    "deathYear": null
  },
  {
    "name": "George Miller",
    "bio": "Australian director, producer, and screenwriter best known for the 'Mad Max' series and 'Happy Feet'.",
    "birthYear": 1945,
    "deathYear": null
  },
  {
    "name": "David Fincher",
    "bio": "American director and producer noted for his meticulous and stylish visual style in films such as 'Fight Club', 'Se7en', and 'The Social Network'.",
    "birthYear": 1962,
    "deathYear": null
  },
  {
    "name": "Martin Scorsese",
    "bio": "American filmmaker regarded as one of the most significant and influential directors in film history, known for 'Taxi Driver', 'Goodfellas', and 'The Irishman'.",
    "birthYear": 1942,
    "deathYear": null
  },
  {
    "name": "Peter Ramsey",
    "bio": "American director, producer, and writer known for co-directing 'Spider-Man: Into the Spider-Verse', which won the Academy Award for Best Animated Feature.",
    "birthYear": 1962,
    "deathYear": null
  },
  {
    "name": "Rodney Rothman",
    "bio": "American filmmaker, writer, and producer who co-directed 'Spider-Man: Into the Spider-Verse' and has written for various films and TV shows.",
    "birthYear": 1974,
    "deathYear": null
  },
  {
    "name": "Daniel Kwan",
    "bio": "American filmmaker and one half of the directing duo known as 'Daniels', known for 'Swiss Army Man' and 'Everything Everywhere All at Once'.",
    "birthYear": 1988,
    "deathYear": null
  },
  {
    "name": "Daniel Scheinert",
    "bio": "American filmmaker and the other half of the directing duo 'Daniels', known for 'Swiss Army Man' and 'Everything Everywhere All at Once'.",
    "birthYear": 1987,
    "deathYear": null
  },
  {
    "name": "Peter Jackson",
    "bio": "New Zealand director, screenwriter, and producer best known for his 'The Lord of the Rings' and 'The Hobbit' trilogies.",
    "birthYear": 1961,
    "deathYear": null
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await MongoMovies.find({});
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Endpoint to return data about a single movie by title
app.get('/movies/title/:title', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const movies = await MongoMovies.find({});
    const movieTitle = req.params.title;
    const movie = movies.find(m => m.title.toLowerCase() === movieTitle.toLowerCase());

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
  });

// Endpoint to return movies by a genre
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const movies = await MongoMovies.find({});
    const genre = req.params.name;
    const filteredMovies = movies.filter(m => m.genre.name.toUpperCase() === genre.toUpperCase());

    if (filteredMovies.length != 0) {
      res.json(filteredMovies);
    } else {
      res.status(404).send('Sorry, not found');
    }

  });

// Endpoint to get a director by name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const directorName = req.params.name;
    const director = directors.find(m => m.name.toLowerCase() === directorName.toLowerCase());

    if (director) {
      res.json(director);
    } else {
      res.status(404).send('Director not found');
    }
  });

// Endpoint to register a new user
app.post('/users', userValidationRules, validateUser, async (req, res) => {
  const bcrypt = require('bcrypt');

  // Hash the password using bcrypt
  let hashedPassword = bcrypt.hashSync(req.body.Password, 10);

  // Check if the username already exists
  await MongoUsers.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        MongoUsers
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await MongoUsers.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await MongoUsers.findOne({ Username: req.params.Username })
      .then((user) => {
        if (user) {
          res.json(user);
      } else {
        res.status(404).send('User not found')
      }
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Endpoint to update user info
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const bcrypt = require('bcrypt');

    let hashedPassword = req.body.Password ? bcrypt.hashSync(req.body.Password, 10) : undefined;

    await MongoUsers.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })

  });

// Endpoint to add a movie to user's favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await MongoUsers.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { favoriteMovies: req.params.MovieID }
    },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Endpoint to remove a movie from user's favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await MongoUsers.findOneAndUpdate({ Username: req.params.Username }, {
      $pull: { favoriteMovies: req.params.MovieID }
    },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Endpoint to deregister a user
// findOneAndRemove has been deprecated, the new one: findOneAndDelete
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await MongoUsers.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Handle errors in express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(8080, () => {
  console.log(`This application server (nodejs) is running on port 8080`);
});