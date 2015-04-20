'use strict';

var express = require('express');
var controller = require('./theme.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.delete);


var dummy = function(req, res) {
  res.json(req.body);
};
router.post('/copy', dummy);
router.post('/activate', dummy);

module.exports = router;
