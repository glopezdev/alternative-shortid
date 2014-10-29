var sid = require('mongoose-shortid');
var Counter = require('./counters'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = mongoose.Types;

function AlternativeShortId(key, options) {
  var myOptions = {table:options.table, generator: customIdGenerator, index: { unique: true }, len: 6, base: 58, retries: 0, alphabet: '23456789ABCDEFGHJKLMNPQRTUVWXYZ_'}
  sid.call(this, myOptions);

  function customIdGenerator(options, callback) {
    Counter.Counter.increment(options.table, function(err, generatedId) {
      convertToShortId(options, generatedId, callback);
    });
  }

  function convertToShortId(options, generatedId, callback) {
    var result = [];

    var num =  new bignum(generatedId);
    while (num.gt(0)) {
        var ord = num.mod(base);
        result.push(alphabet.charAt(ord));
        num = num.div(base);
    }
    var reversed = result.reverse().join("");
    callback(null, reversed);
  }
};

AlternativeShortId.prototype.__proto__ = Object.create(sid.prototype);

Schema.Types.AlternativeShortId = AlternativeShortId;
Types.AlternativeShortId = String;

module.exports = exports = AlternativeShortId;
