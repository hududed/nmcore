const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@nanogrowtech.f2yfi.mongodb.net/?retryWrites=true&w=majority&appName=nanogrowtech`;
mongoose.connect(mongoURI, {
    connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
});

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