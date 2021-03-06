'use strict';

var mongoose = require('mongoose');

var guideSchema = mongoose.Schema({
  destinations: [{
    name: {type: String, required: true},
    url: {type: String, required: true},
    address: {type: String, required: true, unique: true},
    photo: {type: String, required: true}
  }],
  location: {type: String},
  guideName: {type: String},
  userName: {type: String},
  user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

var Guide = mongoose.model("Guide", guideSchema);

module.exports = Guide;
