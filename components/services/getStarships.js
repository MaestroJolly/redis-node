"use strict";

const axios = require('axios');
const redis = require('redis');
const portRedis = process.env.REDIS_PORT || 6379;

//configure redis client on port 6379
const redisClient = redis.createClient(portRedis);

const getStarships = async (data) => {
    try {
        const { id } = data;
        const starShipInfo = await axios.get(
        `https://swapi.co/api/starships/${id}`
        );
    
        //get data from response
        const starShipInfoData = starShipInfo.data;

        //add data to Redis
        redisClient.setex(id, 3600, JSON.stringify(starShipInfoData));
        return starShipInfoData;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = getStarships;


