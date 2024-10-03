// Require the express module
const express = require('express');
const morgan = require('morgan');
const Models = require('./models.js');
const mongoose = require('mongoose');

const MongoMovies = Models.Movies;
const MongoUsers = Models.Users;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cfDB', { });

// Create an instance of express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use morgan middleware
app.use(morgan('common'));

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

app.get('/movies', async (req, res) => {
  const movies = await MongoMovies.find({});
  res.json(movies);
});

// Endpoint to return data about a single movie by title
app.get('/movies/title/:title', async (req, res) => {
  const movies = await MongoMovies.find({});
  const movieTitle = req.params.title;
  const movie = movies.find(m => m.title.toLowerCase() === movieTitle.toLowerCase());

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

// Endpoint to return movies by a genre
app.get('/movies/genre/:name', async (req, res) => {
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
app.get('/directors/:name', (req, res) => {
  const directorName = req.params.name;
  const director = directors.find(m => m.name.toLowerCase() === directorName.toLowerCase());

  if (director) {
    res.json(director);
  } else {
    res.status(404).send('Director not found');
  }

});

// Endpoint to register a new user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
  // console.log('Hello');
  // console.log(req.body.Username);
  await MongoUsers.findOne({ username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        MongoUsers
          .create({
            username: req.body.Username,
            password: req.body.Password,
            email: req.body.Email,
            birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', async (req, res) => {
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
app.get('/users/:Username', async (req, res) => {
  await MongoUsers.findOne({ username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Endpoint to update user info
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', async (req, res) => {
  await MongoUsers.findOneAndUpdate({ username: req.params.Username }, { $set:
    {
      username: req.body.Username,
      password: req.body.Password,
      email: req.body.Email,
      birthday: req.body.Birthday
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
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await MongoUsers.findOneAndUpdate({ username: req.params.Username }, {
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
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  await MongoUsers.findOneAndUpdate({ username: req.params.Username }, {
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
app.delete('/users/:Username', async (req, res) => {
  await MongoUsers.findOneAndDelete({ username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
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
  console.log('Server is running on port 8080');
});
