var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res, next) {
  if(!req.body.username || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "User, email and password are required fields"
    });
    return;
  }
  
  var user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.city = req.body.city;
  user.state = req.body.state;

  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err) { return next(err); }
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
};

module.exports.login = function(req, res, next) {
  
  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) { return next(err); }


    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};