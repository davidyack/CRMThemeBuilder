'use strict';

var express = require('express');
var controller = require('./theme.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.delete);


router.post('/copy', function(req, res) {
  res.json(req.body);
});

module.exports = router;
