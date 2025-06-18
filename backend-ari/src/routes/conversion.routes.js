const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversion.controllers');

router.post('/text-to-json', conversionController.convertTextToJson);
router.post('/json-to-text', conversionController.convertJsonToText);

module.exports = router;
