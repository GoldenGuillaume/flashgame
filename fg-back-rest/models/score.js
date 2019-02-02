const mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
    userIP: {type: String, match: /[0-9]{3}.[0-9]{1,3}.[0-9].[0-9]{1,3}/ },
    name:   String,
    score:  Number
});

module.exports = mongoose.model('Score', scoreSchema);