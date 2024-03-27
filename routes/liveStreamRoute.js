const express = require("express");
const router = express.Router();
const { generateToken, broadCastToken, broadcastTrack } = require("../controllers/liveStreamController.js");

router.post("/viewer-token", generateToken);
router.post("/broadcast-token", broadCastToken);
router.post("/broadcast-track", broadcastTrack);

module.exports = router;
