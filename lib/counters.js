var mongoose = require('mongoose');
//Create the schema
var Schema = mongoose.Schema;

// Definition of the schema
/**
 * The counters schema holds an incremental counter for each table. It's used by the shortID identifiers
 * to control the uniqueness and keep the id as readable as feasible.
 */
var schema = new Schema( {
  // The identifier counter.
  _id: String,
  // The next value of each counter.
  next: {type: Number, 'default': 1}
},{collection:"counters"});

schema.statics.increment = function (counter, callback) {
  return this.findByIdAndUpdate(counter, { $inc: { next: 1 } }, {'new': true, upsert: true, select: {next: 1}}, function(err, result){
    callback(err, result.next);
  });
};

//Compile the model
var Counter = mongoose.model('Counter', schema);

// Make the schema available
exports.Counter = Counter;
