const express = require('express');
const cors = require('cors');

const api = require('./api');

const app = express();
app.use(express.static('static'));
app.use(cors());
app.use('/api', api);
app.listen(3000);
