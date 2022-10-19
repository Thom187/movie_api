// Import Express and it's logging middleware morgan
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
  const mongoose = require('mongoose');
  const Models = require('./models.js');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/myFlixDatabase', {
  useNewUrlParser: true, // Connect the DB (to perform CRUD)
  useUnifiedTopology: true
});

app.use(morgan('common'));
app.use(express.json());

let auth = require('./auth')(app); // Import auth.js; (app) ensures Express is available in auth
const passport = require('passport');
require('./passport');

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// Read/ Return a list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find();
    if (movies) {
      res.status(200).json(movies);
    } else {
      res.status(400).json({ message: 'movies not found'});
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

// Return/READ data about a single movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ title: req.params.title });
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).json({ message: 'Could not find movie.'});
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

// Return/READ data about a genre by name/title
app.get('/genres/:genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ 'genre.name': req.params.genre});
    if (movie) {
      res.status(200).send(movie.genre.description);
    } else {
      res.status(400).send({ message: 'Could not find genre'});
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

// Return/READ data about a director by name
app.get('/directors/:director', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ 'director.name': req.params.director});
    if (movie) {
      res.status(200).send(movie.director);
    } else {
      res.status(400).send({ message: 'Could not find director'});
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

// READ/ Get all existing users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const users = await Users.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(400).json({ message: 'users not found'});
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

// Get a user by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.params.username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: 'Could not find user.'});
    }
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
});

// CREATE a new User : Format JSON :
/* {
     _id: Integer;
     username: String;
     email: String;
     password: String;
     birthday: Date
   }*/
   app.post('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
     Users.findOne({ username: req.body.username })
       .then((user) => {
         if (user) {
           return res.status(400).send(req.body.username + ' already exists');
         } else {
           Users
             .create({
               username: req.body.username,
               email: req.body.email,
               password: req.body.password,
               birthday: req.body.birthday
             })
             .then((user) => { res.status(201).json(user) })
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

// UPDATE an user's info by username: Format JSON:
/* {
  username: String,
  (required)
  password: String,
  (required)
  email: String,
  (required)
  birthday: Date
}*/
app.put('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, { $set:
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      birthday: req.body.birthday
    }
  },
  { new: true }, // makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// UPDATE an existing user
app.put('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// CREATE/ Add a movie to a user's list of favorites
app.post('/users/:username/:movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
Users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favoriteMovies: req.params.MovieID}
  },
  { new: true}, // to make sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// DELETE a favorite movie from the users list
app.delete('/users/:username/:movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favoriteMovies: req.params.MovieID}
  },
  { new: true}, // to make sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// DELETE a user by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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
