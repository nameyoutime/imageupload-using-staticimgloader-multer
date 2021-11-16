const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  title:String,
  description:String,
  file:Array
});


module.exports = imgSchema;