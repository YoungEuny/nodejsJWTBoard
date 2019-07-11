var express = require('express');
var router = express.Router();
var User = require('../models/user');
var util = require('../util');

// create(register)
router.post('/', function (req, res, next) {
  User.findOne({})
    .sort({ user_idx: -1 })
    .exec(function (err, user) {
      if (err) {
        res.status(500);
        return res.json({ success: false, message: err });
      }
      else {
        res.locals.lastId = user ? user.user_idx : 0;
        next();
      }
    });
},
  function (req, res, next) {
    var newUser = new User(req.body);
    newUser.user_idx = res.locals.lastId + 1;
    newUser.save(function (err, user) {
      res.json(err || !user ? util.successFalse(err) : util.successTrue(user));
    })
  }
);

// show(id로)
router.get('/:id', util.isLoggedin, function (req, res, next) {
  User.findOne({ id: req.params.id })
    .exec(function (err, user) {
      res.json(err || !user ? util.successFalse(err) : util.successTrue(user));
    });
});

module.exports = router;
