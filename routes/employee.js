var express = require('express');
var config = require('../config/config');
var util = require('../util')
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();

router.get('/', function(req, res, next) {
    const {
        username,
        token
    } = req.headers;
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
})

router.post('/', function(req, res, next) {
    const {
        username,
        token
    } = req.headers;
    var {
        name,
        phone,
        shift
    } = req.body
    if(shift == '') shift = 'Sunday';
    console.log(req.body,req.headers);
    util.verifyToken(username, token, function(err, data) {
        var message;
        if (err) {
            message = util.createMessage(401, 'Unauthorized Access');
            console.log(err, 'This is');
            return res.send(message);
        }
        var id = util.generateId();
        var dbConnection = config.getConnection();
        dbConnection.collection('profile').update({
            username
        }, {
            $push: {
                employee: {
                    name,
                    phone,
                    shift,
                    id
                }
            }
        }, function(err, data) {
            console.log(err, data.result.ok);
            if (data.result.ok)
                message = util.createMessage(200);
            else
                message = util.createMessage(500);
            res.send(message);
        })
    })
})

router.get('/:name', function(req, res, next) {
  console.log('test')
    var name = req.params.name;
    const {
        username,
        token
    } = req.headers;
    console.log(name);
    util.verifyToken(username, token, function(err, data) {
        console.log(err, data);
        if (err) {
            message = util.createMessage(401);
            return res.send(message);
        }
        var db = config.getConnection();
        db.collection('profile').aggregate([{
            $match: {
                username
            }
        }, {
            $unwind: "$employee"
        }, {
            $match: {
                "employee.name": name
            }
        }, {
            $project: {
                employee: 1,
                _id: 0
            }
        }]).toArray(function(err, data) {
            if (err) {
                console.log(err)
                message = util.createMessage(500);
                return message
            }
            message = util.createMessage(200, 'ok', data)
            return res.send(message);

        })

    })
})


router.put('/',function(req,res,next){
  const { username, token } = req.headers;
  let { name, shift, phone, id } = req.body;
  if (shift == '') shift = 'Monday';
  var count =0;
  var message;
  util.verifyToken(username, token , function(err,data){
    if(err)
      {
        message = util.createMessage(500,'error');
        return res.send(message);
      }
    var dbConnection = config.getConnection();
    dbConnection.collection('profile').update({
      username,
      "employee.id": id
    },{
      $set:{
        "employee.$":{
          name, shift, phone,id
        }
      }
    }, function(err,data){
      message = util.createMessage(500);
      if(data.result.ok)
        message = util.createMessage(200);
      return res.send(message)
    })

  })
})

router.delete('/',function(req,res,next){
  const { username, token } = req.headers;
  let { id } = req.body;
  util.verifyToken(username, token, function(err,data){
    if(err)
      {
        message = util.createMessage(500,'error');
        return res.send(message);
      }
    var dbConnection = config.getConnection();
    dbConnection.collection('profile').update({
      username,
      "employee.id": id
    },{
      $pull:{
        "employee":{
          id
        }
      }
    }, function(err,data){
      console.log(data.result);
      message = util.createMessage(500);
      if(data.result.ok)
        message = util.createMessage(200);
      return res.send(message)
    })
  })
})

module.exports = router;
