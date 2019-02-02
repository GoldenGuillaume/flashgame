var Score = require('../models/score');
var express = require('express');
var router = express.Router();

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
        let newScore = new Score(req.body);
        newScore.save(function (err) {
            if (err){
                return res.send(err);
            }
            res.status(201).json(newScore);
        });
    });

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

function getParameter(req, res, next){
    console.log('Requested Param:', req.params.id);
    next();
}

module.exports = router;
