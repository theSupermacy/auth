exports.getHash = function(password) {
    var salt = Math.random();
    console.log(salt)
    return ({
        salt: salt,
        hash: password
    })
}

exports.createToken = function(salt){
  return salt
}
