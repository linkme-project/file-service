const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define db schema
let FileSchema = new Schema({
  fileName: String,
  fileSize: Number,
  fileUrl: String,
  regDate: Date
});

module.exports = mongoose.model('File', FileSchema);