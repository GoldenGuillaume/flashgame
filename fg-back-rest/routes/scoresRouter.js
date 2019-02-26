var Score = require('../models/score');
var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();

/*
 * All of the routes matching url /scores
 * GET all the scores - POST insert a score
 */
router.route('/scores')
    /* GET list of scores */
    .get(function (req, res) {
        Score.find(function (err, scores) {
            if (err){
                res.send(err);
            }
            res.status(200).json(scores);
        });
    })
    /* POST insert a score */
    .post(function (req, res) {
        let remoteClientIP;
        let env = process.env.NODE_ENV || 'development';
        if(env !== 'development'){
            remoteClientIP = requestIp.getClientIp(req);
        } else{
            remoteClientIP = '127.0.0.1'
        }
        console.log(req.body);
        let newScore = new Score({userIp: remoteClientIP, name: req.body.name, score: req.body.score});
        newScore.save(function (err) {
            if (err){
                return res.send(err);
            }
            res.status(201).json(newScore);
        });
    });

/* GET all the scores sorted descending */
router.get('/scores/desc', function (req, res) {
    Score.find().sort({score: 'desc'}).exec(function (err, scores) {
        if (err){
            res.send(err);
        }
        res.status(200).json(scores);
    });
});

/* GET the highest score */
router.get('/scores/highscore', function (req, res) {
    Score.findOne().sort({score: 'desc'}).limit(1).exec( function (err, score) {
        if (err){
            return res.send(err);
        }
        res.status(200).json(score);
    });
});

/* GET the lowest score */
router.get('/scores/lowscore', function (req, res) {
    Score.findOne().sort({score: 'asc'}).limit(1).exec( function (err, score) {
        if (err){
            return res.send(err);
        }
        res.status(200).json(score);
    });
});

/* GET the number of entries on database */
router.get('/scores/count', function (req, res) {
    Score.count(function (err, count){
        if(err){
            return res.send(err);
        }
        res.status(200).json(count);
    });
});

/* GET a score on a specific IP address */
router.get('/scores/ip', function (req, res) {
    let remoteClientIP;
    let env = process.env.NODE_ENV || 'development';
    if(env !== 'development'){
        remoteClientIP = requestIp.getClientIp(req);
    } else{
        remoteClientIP = '127.0.0.1'
    }
    Score.findOne({userIp: remoteClientIP}, function (err, score) {
        if (err){
            return res.send(err);
        }
        res.status(200).json(score);
    });
});

/* GET the average score  */
router.get('/scores/avg', function (req, res) {
    Score.aggregate().group({"_id": null, "average": {"$avg": "$score"}}).exec(function (err, avg) {
       if (err){
           return res.send(err);
       }
       res.status(200).json(avg[0].average);
    });
});

/*
 * All of the routes matching url /scores/:id
 * Param: id
 * PUT update a score - GET a specific score based on ID
 * DELETE a score
 */
router.route('/scores/:id')
    /* PUT update a score on ID */
    .put(getParameter, function (req, res) {
        Score.findOne({_id: req.params.id}, function (err, score) {
            if (err){
                return res.send(err);
            }
            for(let prop in req.body){
                if(req.body.hasOwnProperty(prop))
                    score[prop] = req.body[prop];
            }
            score.save(function (err) {
                if (err){
                    return res.send(err);
                }
                res.sendStatus(204);
            });
        });
    })
    /* GET a specific score on ID */
    .get(getParameter, function (req, res) {
        Score.findOne({_id: req.params.id}, function (err, score) {
            if (err){
                return res.send(err);
            }
            res.status(200).json(score);
        });
    })
    /* DELETE a score on ID */
    .delete(getParameter, function (req, res) {
        Score.deleteOne({_id: req.params.id}, function (err) {
            if(err){
                return res.send(err);
            }
           res.sendStatus(204);
        });
    });

/*
* middleware function called each time a route have get parameters
*/
function getParameter(req, res, next){
    console.log('Requested Param:', req.params.id);
    next();
}

module.exports = router;
