// Require the express module
const express = require('express');
const morgan = require('morgan');

// Create an instance of express
const app = express();

let movies = [
  {
      title: "The Dark Knight",
      director: "Christopher Nolan",
      year: 2008,
      genre: "Action",
      description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
      imageURL: "http://example.com/darkknight.jpg"
  },
  {
      title: "Inception",
      director: "Christopher Nolan",
      year: 2010,
      genre: "Science Fiction",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
      imageURL: "http://example.com/inception.jpg"
  },
  {
      title: "Parasite",
      director: "Bong Joon-ho",
      year: 2019,
      genre: "Thriller",
      description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      imageURL: "http://example.com/parasite.jpg"
  },
  {
      title: "Mad Max: Fury Road",
      director: "George Miller",
      year: 2015,
      genre: "Action",
      description: "In a post-apocalyptic wasteland, Max teams up with a mysterious woman to try and survive.",
      imageURL: "http://example.com/madmax.jpg"
  },
  {
      title: "Interstellar",
      director: "Christopher Nolan",
      year: 2014,
      genre: "Science Fiction",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      imageURL: "http://example.com/interstellar.jpg"
  },
  {
      title: "The Social Network",
      director: "David Fincher",
      year: 2010,
      genre: "Drama",
      description: "The story of the founders of the social-networking website, Facebook.",
      imageURL: "http://example.com/socialnetwork.jpg"
  },
  {
      title: "The Wolf of Wall Street",
      director: "Martin Scorsese",
      year: 2013,
      genre: "Biography",
      description: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
      imageURL: "http://example.com/wolfofwallstreet.jpg"
  },
  {
      title: "Spider-Man: Into the Spider-Verse",
      directors: ["Peter Ramsey", "Rodney Rothman"],
      year: 2018,
      genre: "Animation",
      description: "Teen Miles Morales becomes Spider-Man of his reality, crossing his path with five counterparts from other dimensions to stop a threat for all realities.",
      imageURL: "http://example.com/spiderman.jpg"
  },
  {
      title: "Everything Everywhere All at Once",
      directors: ["Daniel Kwan", "Daniel Scheinert"],
      year: 2022,
      genre: "Adventure",
      description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
      imageURL: "http://example.com/everything.jpg"
  },
  {
      title: "The Lord of the Rings: The Return of the King",
      director: "Peter Jackson",
      year: 2003,
      genre: "Fantasy",
      description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
      imageURL: "http://example.com/lotr.jpg"
  }
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
