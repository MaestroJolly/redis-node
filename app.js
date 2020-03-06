"use strict";

//set up dependencies
require('dotenv').config();

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const redis = require('redis');
const morgan = require('morgan');

//setup port constants
const portRedis = process.env.REDIS_PORT || 6379;
const port = process.env.PORT || 5000;

//configure redis client on port 6379
const redisClient = redis.createClient(portRedis);

//configure express server
const app = express();

//Morgan middleware
app.use(morgan('dev'));

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware Function to Check Cache
var checkCache = (req, res, next) => {
    const { id } = req.params;
  
    redisClient.get(id, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      //if no match found
      if (data != null) {
        res.send(data);
      } else {
        //proceed to next middleware function
        next();
      }
    });
  };
  


//  Endpoint:  GET /starships/:id
//  @desc Return Starships data for particular starship id

app.get("/starships/:id", checkCache, async (req, res) => {
    try {
      const { id } = req.params;
      const starShipInfo = await axios.get(
        `https://swapi.co/api/starships/${id}`
      );
  
      //get data from response
      const starShipInfoData = starShipInfo.data;

      //add data to Redis
      redisClient.setex(id, 3600, JSON.stringify(starShipInfoData));
  
      return res.json(starShipInfoData);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

//Server started
app.listen(port, () => console.log(`Server is now running on Port ${port}`));