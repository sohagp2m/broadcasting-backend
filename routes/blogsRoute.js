const express = require("express");
const router = express.Router();
const { getBlogs, postBlogs } = require("../controllers/blogsController");

router.get("/blogs", getBlogs);
router.post("/blogs", postBlogs);

module.exports = router;
