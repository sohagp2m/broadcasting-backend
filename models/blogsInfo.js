const { Schema, model, models } = require("mongoose");

const blogsSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  designation: {
    type: String,
  },
});

const blogsInfo = model.blogsInfo || model("blogCollections", blogsSchema);

module.exports = blogsInfo;
