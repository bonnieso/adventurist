'use strict';

var mongoose = require('mongoose');

var guideSchema = mongoose.Schema({
  destinations: [{type: mongoose.Schema, ref: 'Destination'}],
  location: {type: String},
  user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

var Guide = mongoose.model("Guide", guideSchema);

module.exports = Guide;