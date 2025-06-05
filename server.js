// for Node.js DB
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Serve static files from the current directory
// app.use(express.static(__dirname));

// // (your API routes here)

// app.listen(3001, () => {
//   console.log('Server running on http://localhost:3001');
// });


// For MongoDB
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (local)
mongoose.connect('mongodb://localhost:27017/helloworld');

// Define a schema and model
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

// Serve static files
app.use(express.static(__dirname));

// API endpoint to receive form data
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});