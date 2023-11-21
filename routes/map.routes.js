const express = require("express");
const router = express.Router();
const pinsHandler = require("../map-features/pinsHandler");

//routes to to map with pibs
router.get("/pins", pinsHandler.getAllPins);

router.post("/pins", pinsHandler.addPin);

module.exports = router;
