var Score = require('../models/score');
var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();

/* GET a score on a specific IP address */
router.get('/score', function(req, res) {
    var remoteClientIP;
    let env = process.env.NODE_ENV || 'development';
    if(env !== 'development'){
        remoteClientIP = requestIp.getClientIp(req);
    } else{
        remoteClientIP = '127.0.0.1'
    }
    Score.findOne({userIP: remoteClientIP}, function (err, score) {
        if (err){
            return res.send(err);
        }
        res.status(200).json(score);
    });
});

module.exports = router;