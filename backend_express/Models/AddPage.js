const mongoose = require("mongoose");
const { schema } = mongoose;

const Pages = {
  title: {
    type: String,
    required: true,
  },
  subtext: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  attach: [{type: String}],
  
  url: {
    type: String,
    required: true,
  },
  showAuthor: {
    type: Boolean,
    required: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
  modifiedBy: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  published: {
    type: Date,
    required: false,
  },
};
module.exports = mongoose.model("pages", Pages);
