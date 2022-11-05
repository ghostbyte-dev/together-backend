const express = require("express");
const router = express.Router();
const database = require("../database");

router.get("/databyuserid/:userid", (req, res) => {
  database.dbGetSingleRow(
    "SELECT * from user u Where u.id = ?",
    [req.params.userid],
    (result, err) => {
      if (err) {
        return res.status(500).json({ err });
      } else {
        if (result) {
          return res.send(result);
        } else {
          return res.send({ status: 204 });
        }
      }
    }
  );
});

module.exports = router;
