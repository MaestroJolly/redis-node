"use strict";

//set up dependencies
require('dotenv').config();

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const redis = require('redis');
const morgan = require('morgan');

//setup port constants
const port = process.env.PORT || 5000;

//configure express server
const app = express();
const routes = require('./components/routes/handlers');

//Morgan middleware
app.use(morgan('dev'));

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/starships', routes);

//Server started
app.listen(port, () => console.log(`Server is now running on Port ${port}`));