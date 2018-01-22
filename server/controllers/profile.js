var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        if(err) { throw err };
        res.status(200).json(user);
      });
  }

};

module.exports.profileSet = function(req, res, next) {

  console.log('Hello! ' + JSON.stringify(req.body));
  var doc = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    city: req.body.city,
    state: req.body.state
  };
  console.log('Setting user ' + JSON.stringify(doc));
  User
    .findOneAndUpdate({ username: req.body.username }, {$set: doc}, {new: true}, function(err, user) {
      if (err) { return next(err); }
      res.status(200).json(user);
    });
};