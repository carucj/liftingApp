const express = require('express');
const router = express.Router();
const db = require('../models');
const app = express();

app.use(express.json());

app.post('/api/saveData', async (req, res) => {
    try {
        const { data } = req.body;
        const newData = await db.Data.create({ data });
        res.status(201).json(newData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//fetch data from reach, woudl be nice to use axios instead of fetch so we don't need the try/catch stuff
const saveData = async (data) => {
    try {
        const response = await fetch('http://localhost:5000/api/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });
        const result = await response.json();
        console.log('Data saved:', result);
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

// Example usage:
saveData('Your data here');
