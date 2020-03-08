"use strict";

const redis = require('redis');
const portRedis = process.env.REDIS_PORT || 6379;

//configure redis client on port 6379
const redisClient = redis.createClient(portRedis);

//Middleware Function to Check Cache
const checkCache = (req, res, next) => {
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

module.exports = checkCache;