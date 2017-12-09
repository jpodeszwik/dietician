const express = require('express');

const api = require('./api');

const app = express();
app.use(express.static('static'));

app.use('/api', api);
app.listen(3000);
