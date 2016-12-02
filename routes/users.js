var express = require('express');
var config = require('../config/config');
var util = require('../util')
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  const username = req.params['username'];
  const {
      token
  } = req.headers;
  console.log(username, token);
  util.verifyToken(username, token, function(err, data) {
      console.log(err, data);
      if (err) {
          message = util.createMessage(401);
          return res.send(message);
      }
      var db = config.getConnection();
      db.collection('profile').findOne({
        username
      },{
        token:0,
        password : 0,
        hash :0,
        salt : 0,
        updated: 0,
        created: 0
      },function(err,data){
        console.log(err,data,'BItches')
        if(err){
        message = util.createMessage(500);
        return res.send(message);
    }
    message = util.createMessage(200, 'ok', data)
    return res.send(message);
      })
  })
});

module.exports = router;
