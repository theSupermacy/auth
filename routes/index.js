var express = require('express');
var config = require('../config/config');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
    //  console.log(req.dbConection+'test')
    var message = {}
    var status, message , error;
    var id = req.params.id;
    var db = config.getConnection();
    db.collection('profile').findOne({
        _id : ObjectId(id)
    },function(err,data){
      if(err){
        message.status = 500 ;
        message.error = 'Internal Server Error'
      }
      else {
         message.status = 201;
         message.message = 'ok';
         message.data = data
      }

    })
    res.send(message)
});



router.post('/auth', function(req, res, next) {
    //  console.log(req.dbConection+'test')
    var message = {}
    var status, message , error;
    var username = req.body.username;
    var password = req.body.password;
    var hash = getHash(password);
    var db = config.getConnection();
    db.collection('profile').insert({
        username : username,
        hash : hash,
        created : new Date(),
        updated : new Date()
    },function(err,data){
      if(err){
        console.log(err)
        message.status = 500 ;
        message.error = 'Internal Server Error'
      }
      else {
         message.status = 201;
         message.message = 'ok';
         message.data = data
      }
    })
    res.send(message)
});

module.exports = router;
