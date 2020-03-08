"use strict";

const express = require('express');
const router = express.Router();
const getStarshipsServices = require('../../services/getStarships');
const checkCache = require('../../middlewares');

router.get("/:id", checkCache, async (req, res) =>{
    getStarshipsServices(req.params).then(response =>{
        return res.json(response);
    }).catch(error =>{
        return res.status(500).json(error);
    });
})

module.exports = router;