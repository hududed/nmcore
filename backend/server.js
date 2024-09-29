const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/nanogrowtech');

const emailSchema = new mongoose.Schema({
    email: { type: String, required: true },
});

const Email = mongoose.model('Email', emailSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the NanoGrowTech backend!');
});

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    console.log(`Received email: ${email}`); // Log the received email
    const newEmail = new Email({ email });
    await newEmail.save();
    console.log(`Email saved: ${email}`); // Log the saved email
    res.status(201).send('Email subscribed successfully');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});