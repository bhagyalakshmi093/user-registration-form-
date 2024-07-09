require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
console.log('MongoDB URI:', mongoUri);  // Log the MongoDB URI for debugging

if (!mongoUri) {
  console.error('MONGODB_URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/register', (req, res) => {
  console.log('Received form submission:', req.body);  // Log the form submission data for debugging
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });

  newUser.save()
    .then(() => {
      console.log('User registered successfully!');
      res.send('User registered successfully!');
    })
    .catch(err => {
      console.error('Error saving user to database:', err);
      res.send('Error saving user to database.');
    });
});

// Fetch and display all users
app.get('/users', (req, res) => {
  User.find({})
    .then(users => res.json(users))
    .catch(err => res.send('Error fetching users.'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
