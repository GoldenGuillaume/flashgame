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
/* GET home page. */
router.get('/', function(req, res) {
  res.send("<h1>API Scores</h1>\n" +
      "<h2>Routes:</h2>\n" +
      "<h3 style='margin-left: 10%;'>/scores methods:</h3>\n" +
      "<p style='margin-left: 25%;'>GET - get all the scores</p>\n" +
      "<p style='margin-left: 25%;'>POST - insert a score</p>\n" +
      "<h3 style='margin-left: 10%;'>/scores/:id methods:</h3>\n" +
      "<p style='margin-left: 25%;'>GET - get an specific score</p>\n" +
      "<p style='margin-left: 25%;'>PUT - update an specific score</p>\n" +
      "<p style='margin-left: 25%;'>DEL - delete an specific score</p>" +
      "<h3 style='margin-left: 10%;'>/ip/score methods:</h3>\n" +
      "<p style='margin-left: 25%;'>GET - get the user score based on this ip address</p>");
});

module.exports = router;
