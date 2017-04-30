var express = require('express');

var api = require('./api');

var app = express();
app.use(express.static('static'))

app.use('/api', api);
app.listen(3000);
