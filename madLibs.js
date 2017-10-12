var mongoose = require("mongoose");

var libsSchema = mongoose.Schema({
  text: { type: String, required: true },
  created: { type: Date, default: Date() }
});

var libs = mongoose.model("madlibs", libsSchema);

module.exports = libs;
