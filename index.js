require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const weatherRoutes = require('./routes/weatherRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 4001;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/weather', weatherRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});