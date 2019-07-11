// api/contents.js

var express  = require('express');
var router   = express.Router();
var Content     = require('../models/content');
var User     = require('../models/user');
var mongoose = require('mongoose');
var util  = require("../util");
var jwt      = require('jsonwebtoken');


// Create 게시글 작성
router.post('/', util.isLoggedin,
 function(req, res, next){
   var Content1 = new Content(req.body);
   console.log(Content1);
    Content.findOne({})
    .sort({content_idx: -1})
    .exec(function(err, content){
      if(err) {
        res.status(500);
        return res.json({ success: false, message: err });
      }
      else {
        res.locals.lastId = content?content.content_idx:0;
        next();
      }
    });
  },
  function(req, res, next){
    var newContent = new Content(req.body);
    newContent.content_idx = res.locals.lastId + 1;
    User.findById(req.decoded._id)
    .exec(function(err1, user){
      if(err1||!user) {
        return res.json(util.successContentFalse(err1));
      }
      newContent.user_idx = user.user_idx;
      newContent.save(function(err2, content){
        if(err2) {
          res.status(500);
          res.json(util.successContentFalse(err2));
        }
        else {
          res.json(util.successTrue(content));
        }
      });
    })
  }
);

// 게시글 상세 조회
router.get('/:idx', function(req, res, next){
    Content.findOne({content_idx:req.params.idx})
    .exec(function(err1, content1){
      if(err1||!content1) return res.json(util.successContentFalse(err1));

      // 게시물이 공개일 때
      if(content1.open === true) {
        content1.count = content1.count + 1;

        content1.save(function(err2, content2){
          res.json(err2||!content2? util.successContentFalse(err2): util.successTrue(content2));
        });
      } else {  // 게시물이 비공개일 때
        var token = req.headers['x-access-token'];
        // 로그인이 되어있지 않을 때
        if (!token) return res.json(util.successFalse(null, 'token is required'));
        else { // 로그인이 되어있을 때
          jwt.verify(token, 'MySuperSecretKey', function(err, decoded) {
            if(err) return res.json(util.successFalse(err));
            else{
              req.decoded = decoded;
              content1.count = content1.count + 1;

              content1.save(function(err3, content3){
                res.json(err3||!content3? util.successContentFalse(err3): util.successTrue(content3));
              });
            }
          })
        }
      }
    });
  }
);

// 게시글 목록 조회
router.get('/',
  function(req, res, next){
    Content.find()
    .sort({content_idx: 1})
    .exec(function(err, contents){
      if(err) {
        res.status(500);
        res.json(util.successFalse(err));
      }
      else {
        res.json(util.successTrue(contents));
      }
    });
  }
);

module.exports = router;
