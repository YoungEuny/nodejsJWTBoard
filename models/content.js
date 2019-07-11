// models/post.js

var mongoose = require('mongoose');

var contentSchema = mongoose.Schema({
    content_idx: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
        requiered:[true, 'title is requiered!']
    },
    description: {
        type: String,
        requiered:[true, 'description is requiered!']
    },
    count: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    open: {// true: 공개, false: 비공개
        type: Boolean,
        default: true
    },
    user_idx: {
        type: Number
    }
});

var Content = mongoose.model('content', contentSchema);
module.exports = Content;