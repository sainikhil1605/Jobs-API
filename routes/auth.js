const { login, register } = require('../controllers/auth');
const router = require('express').Router();

router.post('/login', login);
router.route('/register').post(register);

module.exports = router;
