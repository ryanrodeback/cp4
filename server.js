const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/stocks', {
  useNewUrlParser: true
});


// Create a scheme for items in the museum: a ticker and an amount.
const itemSchema = new mongoose.Schema({
  ticker: String,
  amount: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Create a new stock in the portfolio: takes a ticker and an amount.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    ticker: req.body.ticker,
    amount: req.body.amount,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Edit item
app.put('/api/items/:id', async (req, res) => {
  try {
    await Item.findOneAndUpdate({
        _id: req.params.id
      },
      req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));