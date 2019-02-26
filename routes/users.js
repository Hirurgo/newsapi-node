const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const auth = require('../auth');

router.get('/:email?', auth, usersController.get);
router.post('/testauth', usersController.testauth);
router.post('/register', usersController.add);
router.delete('/:email?', auth, usersController.delete);
module.exports = router;