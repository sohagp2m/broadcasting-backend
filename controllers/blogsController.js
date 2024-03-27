const blogsInfo = require("../models/blogsInfo.js");

const postBlogs = async (req, res) => {
  try {
    const newBlogs = req.body;

    if (newBlogs) {
      await blogsInfo.create(newBlogs);
      res.send("Contact added successfully");
    } else {
      res.send("try again, not added contact");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBlogs = async (req, res) => {
  try {
    const result = await blogsInfo.find();
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { postBlogs, getBlogs };
