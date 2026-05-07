const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = '2-229340333';

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route 1: Homepage - GET all books
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,author,genre`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.get(url, { headers });
        const books = response.data.results;
        res.render('homepage', { title: 'Books | HubSpot Practicum', books });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching books');
    }
});

// Route 2: GET - Show the form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// Route 3: POST - Submit the form and create a new book
app.post('/update-cobj', async (req, res) => {
    const { name, author, genre } = req.body;
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const body = {
        properties: { name, author, genre }
    };
    try {
        await axios.post(url, body, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating book');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));