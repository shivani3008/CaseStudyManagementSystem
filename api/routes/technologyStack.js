const express = require('express');
const router = express.Router();

const techStackController = require('../controllers/technologyStack');
const checkAuth = require('../middleware/check_Auth');

router.post('/', checkAuth,  techStackController.insertTechStacks);

router.get('/', checkAuth, techStackController.getAllTechStacks);

module.exports = router;