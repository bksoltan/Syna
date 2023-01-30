const express = require("express");
const { reportSubscription } = require("../../controller/api/admin");

const router = express.Router();

router.post("/report-result", reportSubscription);

module.exports = router;
