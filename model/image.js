const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Image = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model("Image", Image);
