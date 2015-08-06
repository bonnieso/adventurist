'use strict';

var mongoose = require('mongoose');

var destinationSchema = mongoose.Schema({
  name: {type: String, required: true},
  url: {type: String, required: true},
  address: {type: String, required: true},
  photo: {type: String, required: true}
});

var Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination;