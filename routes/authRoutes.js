const express = require('express');
const { check } = require('express-validator');
const { signup, signin, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post(
  '/signup',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  signup,
);

router.post(
  '/signin',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  signin,
);

router.get('/me', auth, getMe);

module.exports = router;
