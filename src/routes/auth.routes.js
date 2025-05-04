const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  // validate input
  
  // BUSSINESS LOGIC
  // get user by username -> data
  // check password against stored hashed password
  // check if user has existing session
  // create new session
  
})

router.post("/logout", (req, res) => {
})

module.exports = router;
