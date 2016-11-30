var MongoClient = require('mongodb').MongoClient;

var config = {
    dbURL: 'mongodb://localhost:27017/auth-backend',
    db: null,
}
var getConnection = function() {
    return config.db
}

var close = function(done) {
    if (state.db) {
        config.db.close(function(err, result) {
            config.db = null
            config.mode = null
            done(err);
        })
    }
}

exports.connectDB = function(url, done) {
    if (config.db) return done(null, config.db)
    MongoClient.connect(url, function(err, db) {
        if (err) return done(err)
        config.db = db
        done(null, config.db)
    })
}

exports.getIndexes = function(collectionName, done) {
    console.log('collectionName', collectionName)
    if (!collectionName) return done('Invalid collection name')
    if (getConnection()) {
        var db = getConnection();
        db.collection(collectionName).indexInformation(function(err, data) {
            if (err) return done(err)
            else return done(null, data)
        })
    }
    return done('Database Not Connected');
}
var createIndexes = function(collectionName, feildname,options,done) {
    if (typeof feildname != 'object' ) return done('Invalid Feild Name');
    if (!collectionName) return done('Invalid collection name')
    if (!options) options = {}
    if (getConnection()) {
        var db = getConnection();
        db.collection(collectionName).createIndex(feildname,options,function(err, data) {
            if (err) return done(err)
            else return done(null, data)
        })
    }
    return done('Database Not Connected');
}
exports.createIndexes = createIndexes;
exports.dbURL = config.dbURL;
exports.close = close;
exports.getConnection = getConnection;
