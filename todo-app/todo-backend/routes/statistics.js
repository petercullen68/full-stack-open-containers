const RedisClient = require("../redis");
const {REDIS_KEY} = require("../util/config");
const express = require("express");
const router = express.Router();

router.get('/', async (_, res) => {
  RedisClient.get(REDIS_KEY) .then(value => {
    const parsed = Number.parseInt(value ?? '0', 10)
    const counter = Number.isNaN(parsed) ? 0 : parsed
    const statistics = {
      'added_todos': counter,
    }
    res.send(statistics);
  })
});

module.exports = router;