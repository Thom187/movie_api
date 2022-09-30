// Import Express and it's logging middleware morgan
const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
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
let topMovies = [
  {
    title: 'Title 1',
    director: 'Director 1'
  },
  {
    title: 'Title 2',
    director: 'Director 2'
  },
  {
    title: 'Title 3',
    director: 'Director 3'
  },
  {
    title: 'Title 4',
    director: 'Director 4'
  },
  {
    title: 'Title 5',
    director: 'Director 5'
  },
  {
    title: 'Title 6',
    director: 'Director 6'
  },
  {
    title: 'Title 7',
    director: 'Director 7'
  },
  {
    title: 'Title 8',
    director: 'Director 8'
  },
  {
    title: 'Title 9',
    director: 'Director 9'
  },
  {
    title: 'Title 10',
    director: 'Director 10'
  },
];
