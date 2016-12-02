var config = require('./../config/config');
var crypto = require('crypto');
exports.getHash = function(password) {
    var salt = Math.random();
    console.log(salt)
    return ({
        salt: salt,
        hash: password
    })
}

exports.createToken = function(salt) {
  var token = crypto.randomBytes(48).toString('hex');
    return token
}

exports.verifyToken = function(username, token, done) {
    var error;
    if (!username || !token ) {
        error = 'Token or Username not present';
        return (process.nextTick(function() {
            done(error);
        }));
    }
    var dbConnection = config.getConnection();
    console.log(username,token, 'pika pika')
    dbConnection.collection('profile').find({
      username,
      token
    }).toArray(function(err, data) {
      console.log(data,err,'bc')
        if (err)
            return done(err)
        if (data && data[0] && data[0].username === username)
            return done(null, true);
        return done('Unauthorized Access')
    })
}

exports.createMessage = function(status, message, obj) {
  var payload = obj;
  if(!obj) payload = {};
  if(payload.constructor === Array){
    payload ={}
    payload.data = obj
  }
  var defaultMessage = '';
  if(status == 401) defaultMessage = 'Unauthorized Access';
  if(status == 200) defaultMessage = 'Ok';
  if(status == 500) defaultMessage = 'Internal Server Error';
  var sendingMessage = {
    status,
    message: message || defaultMessage
  }
  var totKeys = Object.keys(payload);
  for(var i = 0; i< totKeys.length;i++){
    sendingMessage[totKeys[i]]= payload[totKeys[i]];
  }
  console.log(sendingMessage)
  return sendingMessage;
}

exports.generateId = function(){
    var token = crypto.randomBytes(32).toString('hex');
    return token;
}
