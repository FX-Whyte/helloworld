const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const contactsPath = path.join(__dirname, 'contacts.json');

// Serve static files (for your HTML, CSS, etc.)
app.use(express.static(__dirname));

// Contact form endpoint (save to contacts.json)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  const contact = { name, email, message, date: new Date() };

  fs.readFile(contactsPath, (err, data) => {
    let contacts = [];
    if (!err && data.length > 0) {
      try {
        contacts = JSON.parse(data);
      } catch {
        // If JSON is invalid, start fresh
        contacts = [];
      }
    }
    contacts.push(contact);

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save contact.' });
      }
      res.json({ success: true, message: 'Contact saved!' });
    });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});