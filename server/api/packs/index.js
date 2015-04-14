'use strict';

var express = require('express');
var controller = require('./theme.controller');

var router = express.Router();

router.get('/', controller.index);
router.put('/', controller.update);

router.post('/install', function(req, res) {
  res.json(req.body);
});

module.exports = router;
