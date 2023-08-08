// Create web server
// --------------------------------------

const express = require('express');
const app = express();
const port = 3000;

// Set up the template engine
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

// Set up the static directory
app.use(express.static('static'));

// Parse the body of the request
app.use(express.json());
app.use(express.urlencoded());

// Set up the database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('comments.db');

// Display the form
app.get('/', (req, res) => {
  res.render('form');
});

// Handle the form submission
app.post('/', (req, res) => {
  db.run('INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)', [
    req.body.name,
    req.body.email,
    req.body.comment
  ], (err) => {
    if(err) {
      res.render('error', { message: 'Error inserting comment' });
    } else {
      res.redirect('/comments');
    }
  });
});

// Display all the comments
app.get('/comments', (req, res) => {
  db.all('SELECT * FROM comments', (err, comments) => {
    if(err) {
      res.render('error', { message: 'Error reading comments' });
    } else {
      res.render('comments', { comments: comments });
    }
  });
});

// Start the web server
app.listen(port, () => {
  console.log(`Web server started on port ${port}`);
});