var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  title: {
    type: String,
    trim: true,
    required: true
  },

  link: {
    type: String,
    required: true,
    unique:true
  },

  summary: {
      type: String,
      trim: true,
      required: true,
  },

  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },

  saved: {
      type: Boolean,
      default: false
  }
},{
    timestamps : true
});


var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
