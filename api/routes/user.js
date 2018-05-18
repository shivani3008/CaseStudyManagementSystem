const express = require('express');
const router = express.Router();

const loginController = require('../controllers/user');
const checkAuth = require('../middleware/check_Auth');

router.post('/loginAD', loginController.userLoginWithAD);
router.post('/findUsers', checkAuth, loginController.findUsers);

// EXTRA
router.post('/login', loginController.userLogin);
router.get('/getAllUser', checkAuth, loginController.userGetAll);

module.exports = router;