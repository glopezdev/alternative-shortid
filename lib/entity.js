var mongoose = require('mongoose');
var path = require('path');
var ShortId = require('./AlternativeShortId');
var sid = require("mongoose-shortid");

var bignum = require('bignum');

// Create the schema
var Schema = mongoose.Schema;

// Definition of the schema
var schema = new Schema( {
  _id: {type: ShortId, table:"entityName"},
  name: { type: String},
},{collection:"entityName"});


// Compile the model
var Entity = mongoose.model('Entity', schema);

// Make the schema available
exports.Entity = Entity;
