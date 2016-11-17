var MongoClient = require('mongodb').MongoClient

var config = {
  dbURL: 'mongodb://localhost:27017/auth-backend',
  db: null,
}

exports.config = config;
exports.connectDB = function(url, done) {
  if (config.db) return done(null,config.db)
  MongoClient.connect(url, function(err, db) {
    if (err) return done(err)
    config.db = db
    done(null,config.db)
  })
}

exports.getConnection = function() {
  return config.db
}

exports.close = function(done) {
  if (state.db) {
    config.db.close(function(err, result) {
      config.db = null
      config.mode = null
      done(err)
    })
  }
}
