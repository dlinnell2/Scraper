var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: String,
},{
    timestamps : true
});

var Note = mongoose.model("Comment", CommentSchema);

module.exports = Note;