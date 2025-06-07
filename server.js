console.log('Starting server...');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const contactsPath = path.join(__dirname, 'contacts.json');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const contact = { name, email, message, date: new Date() };

  // Save to contacts.json
  fs.readFile(contactsPath, (err, data) => {
    let contacts = [];
    if (!err && data.length > 0) {
      try {
        contacts = JSON.parse(data);
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        return res.status(500).json({ error: 'Failed to parse contacts file.' });
      }
    }
    contacts.push(contact);

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), async err => {
      if (err) {
        console.error('Failed to save contact:', err);
        return res.status(500).json({ error: 'Failed to save contact.' });
      }
      console.log('Received contact:', contact);

      // Send email via Gmail SMTP
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'onyemekeihiaclinton@gmail.com',        // <-- your Gmail address
            pass: 'vommtpgcibjmnxel'           // <-- your Gmail App Password
          }
        });

        const mailOptions = {
          from: email,
          to: 'onyemekeihiaclinton@gmail.com',            // <-- your Gmail address
          subject: `New Contact Form Submission from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Form received and email sent!' });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
        res.status(500).json({ error: 'Failed to send email.' });
      }
    });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handlers (keep these at the very bottom)
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});