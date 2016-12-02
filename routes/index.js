var express = require('express');
var config = require('../config/config');
var util = require('../util')
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();

/* GET home page. */
// router.get('/:id', function(req, res, next) {
//     //  console.log(req.dbConection+'test')
//     console.log(req.params['id'])
//     var message = {}
//     var status, message, error;
//     var id = req.params.id;
//     var db = config.getConnection();
//     db.collection('profile').findOne({
//         _id: ObjectId(id)
//     }, function(err, data) {
//         if (err) {
//             message.status = 500;
//             message.error = 'Internal Server Error'
//         } else {
//             message.status = 201;
//             message.message = 'ok';
//             message.data = data
//         }
//
//     })
//     res.send(message)
// });



router.post('/auth/login', function(req, res, next) {
    var message = {}
    var status, message, error;
    var username = req.body.username;
    var password = req.body.password;
    var hash, salt, mix;
    var mix = util.getHash(password);
    var salt = mix.salt;
    var hash = mix.hash;
    var token = util.createToken(salt);
    var db = config.getConnection();
    db.collection('profile').insert({
        username: username,
        hash: hash,
        salt: salt,
        token: token,
        created: new Date(),
        updated: new Date()
    }, function(err, data) {
        if (err) {
            if (err.code == 11000) {
                db.collection('profile').findOne({
                    username: username
                },function(error, data) {
                  console.log(data);
                      if(data){
                        if(data.hash === password)
                        {
                          if(data.token) token = data.token;
                          message.status = 200;
                          message.message = 'you are Logging in';
                          message.token = token;
                          message._id = data._id;
                          message.username = data.username;
                          console.log(message,data)
                          res.send(message);
                          db.collection('profile').update({
                            username
                          },{$set : {
                            token
                          }},function(err,data){
                            if(data){
                              console.log('written to db')
                            }
                          })
                          // console.log()
                          return ;
                        }
                        else {
                          message.status = 403;
                          message.error = 'Forbidden';
                          res.send(message);
                          return;
                        }
                      }
                })
                if(error){
                  res.send(message)
                  return;
                }

            }
            else{
              console.log(err)
              message.status = 500;
              message.error = err;
              res.send(message)
              return;
            }
        } else {
            message.status = 201;
            message.message = 'Profile created!!';
            message.token = token;
            message.username = data.ops[0].username;
            console.log(message,data)
            res.send(message)
            return;
        }
    })
});

router.post('/auth/logout', function(req, res, next) {
  var { username, token } = req.headers;
  var message = '';
  util.verifyToken(username,token, function(err,data){
    if(err) {
      console.log(err);
      message = util.createMessage(500);
      if(err == 'Unauthorized Access')
        message = util.createMessage(401)
      return res.send(message)
    }
    var dbConnection =  config.getConnection();
    dbConnection.collection('profile').update({
      username,token
    },{
      $unset: {token:1}
    },function(err,data) {
      message = util.createMessage(200);
      if(err)
      message = util.createMessage(500);
      return res.send(message)
    })

  })
})

module.exports = router;
