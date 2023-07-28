const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

// Database connection
const MONGODB_URI = 'mongodb://localhost:27017/curd'; 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});
const Item = mongoose.model('Item', itemSchema);

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Default Route - Redirect to the items page
app.get('/', (req, res) => {
    res.redirect('/items');
  });



// RESTful Routes
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.render('index', { items });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/items/new', (req, res) => {
  res.render('new');
});

app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    await Item.create({ name, description });
    res.redirect('/items');
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/items/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    res.render('edit', { item });
  } catch (err) {
    console.error('Error fetching item for editing:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await Item.findByIdAndUpdate(id, { name, description });
    res.redirect('/items');
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Item.findByIdAndRemove(id);
    res.redirect('/items');
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
