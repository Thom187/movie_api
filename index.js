// Import Express and it's logging middleware morgan
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// CREATE a new User
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('New user needs a name.')
  }
});

// UPDATE an existing user
app.put('/users/:id', (req, res) => {
  const { id } =req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.ID == id );

  if (user) {
    user.Name = updatedUser.Name;
    res.status(200).json(user);
  } else {
    res.status(400).send('Could not find this user.')
  }
});

// Create a new favorite movie for a user
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.ID == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(201).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('Could not find this user')
  }
});

// DELETE a favorite movie from the users list
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.ID == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(201).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('Could not find this user')
  }
});

// DELETE a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.ID == id );

  if (user) {
    users = users.filter( user => user.ID != id);
    res.status(201).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('Could not find this user')
  }
});

// Return/READ a list of all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// Return/READ data about a single movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('Could not find that movie.')
  }
});

// Return/READ data about a genre by name/title
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('Could not find that genre.')
  }
});

// Return/READ data about a director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('Could not find that director.')
  }
});

// Automatically route all requests for static files to folder /public
app.use(express.static('public'));

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
})

// Add a error handler and log information (via the error property err.stack)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something does not work!');
});

// listen for any requests
app.listen(8080, () => {
  console.log('myFlix is listening on port 8080.');
});


// Create an array of movies to load it as JSON
let movies = [
  {
    Title: 'Title 1',
    Description: 'Description 1',
    Genre: {
      Name: 'genreName 1',
      Description: 'genreDescription 1'
    },
    Director: {
      Name: 'directorName 1',
      Bio: 'directorBio 1',
      Birth: 'directorBirth 1'
    }
  },
  {
    Title: 'Title 2',
    Description: 'Description 2',
    Genre: {
      Name: 'genreName 2',
      Description: 'genreDescription 2'
    },
    Director: {
      Name: 'directorName 2',
      Bio: 'directorBio 2',
      Birth: 'directorBirth 2'
    }
  },
  {
    Title: 'Title 3',
    Description: 'Description 3',
    Genre: {
      Name: 'genreName 3',
      Description: 'genreDescription 3'
    },
    Director: {
      Name: 'directorName 3',
      Bio: 'directorBio 3',
      Birth: 'directorBirth 3'
    }
  },
  {
    Title: 'Title 4',
    Description: 'Description 4',
    Genre: {
      Name: 'genreName 4',
      Description: 'genreDescription 4'
    },
    Director: {
      Name: 'directorName 4',
      Bio: 'directorBio 4',
      Birth: 'directorBirth 4'
    }
  },
  {
    Title: 'Title 5',
    Description: 'Description 5',
    Genre: {
      Name: 'genreName 5',
      Description: 'genreDescription 5'
    },
    Director: {
      Name: 'directorName 5',
      Bio: 'directorBio 5',
      Birth: 'directorBirth 5'
    }
  }
];

let users = [
  {
    ID: 1,
    Name: 'Name 1',
    favoriteMovies: ['Movie 1', 'Movie 2']
  },
  {
    ID: 2,
    Name: 'Name 2',
    favoriteMovies: ['Movie 2', 'Movie 3']
  }
];
