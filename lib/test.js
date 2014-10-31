(function() {
  "use strict";
  /* jshint node:true */
  var async = require('async');
  var path = require('path');
  var assert = require("assert");

  var Entity = null;

  describe(path.basename(__filename), function() {
    before(function(done) {
      require("./mongoCfg")(function() {
        var mongoose = require("mongoose");
        var bignum = require('bignum');
        var EntitySchema = require('./entity');
        Entity = mongoose.model('Entity');

        
        done();
      });
    });

    describe("entityModel", function() {

      afterEach(function(done) {
        async.parallel([ function(callback) {
          Entity.remove({
            name: 'test'
          }, callback);
        } ], done);
      });

      it("should being able to create multiple entities", function(done) {
        
        var entity;
        var target = 3;
        var insertedValues = 0;
        var stime = new Date().getTime();
        var threshold = 2000;
        console.time('elements');
        async.times(target,function(n,cb){
          new Entity({
            name: 'test'
          }).save(function(err, result) {
            if (err)
              cb(err);
            insertedValues++;
            cb();
          });
        },function(err){
          console.timeEnd('elements');
          var tt = new Date().getTime() - stime;
          assert.ok(tt < threshold,"took too long");
          assert.equal(insertedValues,target,"not all done");
          console.log("%s records took %s ms",insertedValues,tt);
          done(err);
        });
      });
    });
  });
})();
