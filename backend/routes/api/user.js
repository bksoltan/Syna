const express = require("express");
const { getPoint, mate, auction } = require("../../controller/api/user");

const router = express.Router();

router.get("/point/:address", getPoint);
router.post("/point/mate", mate);
router.post("/point/auction", auction);

module.exports = router;
