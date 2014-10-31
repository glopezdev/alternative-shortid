var sid = require('mongoose-shortid');

var Counter = require('./counters'),
    mongoose = require('mongoose'),
    bignum = require('bignum'),
    Schema = mongoose.Schema,
    Types = mongoose.Types;

function AlternativeShortId(key, opt) {
  var myOptions = {generatorOptions:{table: opt.table, len: 6, base: 58, retries: 0, alphabet: '23456789ABCDEFGHJKLMNPQRTUVWXYZ_'}, generator: customIdGenerator, index: { unique: true }}
  sid.call(this, key, myOptions);

  function customIdGenerator(options, callback) {
    Counter.Counter.increment(options.table, function(err, generatedId) {
      convertToShortId(options, generatedId, callback);
    });
  }

  function convertToShortId(options, generatedId, callback) {
    var result = [];

    var num =  new bignum(generatedId);
    while (num.gt(0)) {
        var ord = num.mod(options.base);
        result.push(options.alphabet.charAt(ord));
        num = num.div(options.base);
    }
    var reversed = result.reverse().join("");
    callback(null, reversed);
  }
};

AlternativeShortId.prototype.__proto__ = Object.create(sid.prototype);
AlternativeShortId.prototype.constructor = AlternativeShortId;

Schema.Types.AlternativeShortId = AlternativeShortId;
Types.AlternativeShortId = String;

module.exports = exports = AlternativeShortId;

var defaultSave = mongoose.Model.prototype.save;
mongoose.Model.prototype.save = function(cb) {
  for (fieldName in this.schema.tree) {
    if (this.isNew && this[fieldName] === undefined) {
        var idType = this.schema.tree[fieldName];
        if (idType === AlternativeShortId || idType.type === AlternativeShortId) {
            var idInfo = this.schema.path(fieldName);
            var retries = idInfo.retries;
            var self = this;
            
            (function attemptSave(fieldName,idInfo) {
                idInfo.generator(idInfo.generatorOptions, function(err, id) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    self[fieldName] = id;
                    defaultSave.call(self, function(err, obj) {
                        if (err &&
                            err.code == 11000 &&
                            err.err.indexOf(fieldName) !== -1 &&
                            retries > 0
                        ) {
                            --retries;
                            attemptSave();
                        } else {
                            // TODO check these args
                            cb(err, obj);
                        }
                    });
                });
            })(fieldName,idInfo);
            return;
        }
    }
  }
  defaultSave.call(this, cb);
};
