// api/auth.js

var express  = require('express');
var router   = express.Router();
var User     = require('../models/user');
var util     = require('../util');
var jwt      = require('jsonwebtoken');

// login
router.post('/login',
  function(req,res,next){
    var isValid = true;
    var validationError = {
      name:'ValidationError',
      errors:{}
    };

    if(!req.body.id){
      isValid = false;
      validationError.errors.id = {message:'id is required!'};
    }
    if(!req.body.password){
      isValid = false;
      validationError.errors.password = {message:'Password is required!'};
    }

    if(!isValid) {
      return res.json(util.successFalse(validationError));
    }
    else next();
  },
  function(req,res,next){
    User.findOne({id:req.body.id})
    .select({password:1,id:1})
    .exec(function(err,user){
      if(err) {
        return res.json(util.successFalse(err));
      }
      else if(!user||!user.authenticate(req.body.password)){
         return res.json(util.successFalse(null,'id or Password is invalid'));
        }
      else {
        var payload = {
          // user_idx : user.user_idx,
          _id: user._id,
          id: user.id
        };
        var secretOrPrivateKey = 'MySuperSecretKey';
        var options = {expiresIn: 60*60*24};
        jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
          if(err) {
            return res.json(util.successFalse(err));
          }
          res.json(util.successTrue(token));
        });
      }
    });
  }
);

module.exports = router;
