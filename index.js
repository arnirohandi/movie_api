// Require the express module
const express = require('express');
const morgan = require('morgan');
const Models = require('./models.js');

const NewMovies = Models.Movies;
const NewUsers = Models.Users;

// Create an instance of express
const app = express();

// Use morgan middleware
app.use(morgan('common'));

let movies = [
  {
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: "Science Fiction",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
    imageURL: "http://example.com/inception.jpg",
    featured: false
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genre: "Action",
    description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    imageURL: "http://example.com/darkknight.jpg",
    featured: true
  },
  {
    title: "Parasite",
    director: "Bong Joon-ho",
    year: 2019,
    genre: "Thriller",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    imageURL: "http://example.com/parasite.jpg",
    featured: false
  },
  {
    title: "Mad Max: Fury Road",
    director: "George Miller",
    year: 2015,
    genre: "Action",
    description: "In a post-apocalyptic wasteland, Max teams up with a mysterious woman to try and survive.",
    imageURL: "http://example.com/madmax.jpg",
    featured: false
  },
  {
    title: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Science Fiction",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    imageURL: "http://example.com/interstellar.jpg",
    featured: false
  },
  {
    title: "The Social Network",
    director: "David Fincher",
    year: 2010,
    genre: "Drama",
    description: "The story of the founders of the social-networking website, Facebook.",
    imageURL: "http://example.com/socialnetwork.jpg",
    featured: false
  },
  {
    title: "The Wolf of Wall Street",
    director: "Martin Scorsese",
    year: 2013,
    genre: "Biography",
    description: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
    imageURL: "http://example.com/wolfofwallstreet.jpg",
    featured: false
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    directors: ["Peter Ramsey", "Rodney Rothman"],
    year: 2018,
    genre: "Animation",
    description: "Teen Miles Morales becomes Spider-Man of his reality, crossing his path with five counterparts from other dimensions to stop a threat for all realities.",
    imageURL: "http://example.com/spiderman.jpg",
    featured: false
  },
  {
    title: "Everything Everywhere All at Once",
    directors: ["Daniel Kwan", "Daniel Scheinert"],
    year: 2022,
    genre: "Adventure",
    description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    imageURL: "http://example.com/everything.jpg",
    featured: false
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
    year: 2003,
    genre: "Fantasy",
    description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    imageURL: "http://example.com/lotr.jpg",
    featured: false
  }
];

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

app.get('/movies', (req, res) => {
  res.json(movies);
});

// Endpoint to return data about a single movie by title
app.get('/movies/title/:title', (req, res) => {
  const movieTitle = req.params.title;
  const movie = movies.find(m => m.title.toLowerCase() === movieTitle.toLowerCase());

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

// Endpoint to get a genre by name/title
app.get('/genres/:name', (req, res) => {
  const genre = req.params.name;
  const filteredMovies = movies.filter(m => m.genre.toUpperCase() === genre.toUpperCase());

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
app.post('/users/:username', (req, res) => {
  res.send(`User ${req.params.username} will be registered (not implemented just yet) `);
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

// Handle errors in express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
