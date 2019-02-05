var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    console.log('Time of API Call:', new Date().toString());
    console.log('Requested PATH:', req.path);
    console.log('Requested Method:', req.method);
    if(Object.keys(req.body).length !== 0){
        console.log('Requested Body:', req.body.userIP,'-', req.body.name,'-', req.body.score);
    }
    next();
});

module.exports = router;
