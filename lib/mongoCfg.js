
var mongoose = require('mongoose');
//mongoose.set("debug",true)
require("mongoose-nested");
/* jshint eqnull:true */
module.exports = function (cb) {

  if (mongoose.connection._readyState === 0) {
    var opened = false;
    mongoose.connection.on("error", function (error) {
      // if we've never been opened before then we must call this code when
      // opened
      if (!opened) {
        mongoose.connection.db.collection("test").count(function (err, count) {
          mongoose.connection.onOpen();
        });
      }
    });
    mongoose.connection.on("open", function (err) {
      opened = true;
      cb(err);
    });
    mongoose.connect('mongodb://localhost/test', {
      server : {
        auto_reconnect : true,
        numberOfRetries : 1000000
      }
    });
  } else {
    cb()
  }
};
