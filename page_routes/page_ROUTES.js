const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/prayaas/register", (req, res) => {
  res.sendFile("public/register.html", { root: __dirname });
});

module.exports = router;
