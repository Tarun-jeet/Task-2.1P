const express = require('express');
const bodyParser = require('body-parser');
const mailgun = require('mailgun-js');
const path = require('path');

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));

// Set up Mailgun API
const mg = mailgun({ apiKey: 'db4b9608706fabfd3ac628452a346071-2b755df8-cc0d9f98', domain: 'sandboxb8787b514d1443f58809c424aed7f7ac.mailgun.org' });

// Function to send a welcome email
const sendWelcomeEmail = (email, firstName) => {
    const data = {
        from: 'tarunjeet4829.be23@chitkara.edu.in',
        to: email,
        subject: 'Welcome to DEV@Deakin!',
        text: `Hi ${firstName}, welcome to DEV@Deakin! Congratulations to be with us.`,
        html: `<p>Hi ${firstName},</p><p>Welcome to <strong>DEV@Deakin</strong>! We're glad to have you with us.</p>`,
    };

    return mg.messages().send(data, (error, body) => {
        if (error) {
            console.error('Error sending welcome email:', error);
            throw error;
        }
        console.log('Welcome email sent:', body);
    });
};

// Endpoint to display the form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Endpoint to handle new subscriber
app.post('/', (req, res) => {
    const { email, firstName } = req.body;

    // Call the function to send a welcome email
    sendWelcomeEmail(email, firstName).then(() => {
            res.status(200).json({ message: 'Subscription successful.' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Subscription failed', error });
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


