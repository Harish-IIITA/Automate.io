var express = require('express');
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');

const app = express();
var cors = require('cors');

var index = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(express.static(path.join(__dirname, './public')));
// app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
//parse requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use('/', index);

module.exports = app;
