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
    const {
        name,
        phone,
        shift
    } = req.body

    util.verifyToken(username, token, function(err, data) {
        var message;
        if (err) {
            message = util.createMessage(401, 'Unauthorized Access');
            console.log(err);
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

module.exports = router;
