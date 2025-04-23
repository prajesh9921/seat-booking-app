const express = require('express');
const router = express.Router();
const { bookingSeats, resetSeats, getSeats, signup, login } = require('../controller/seats.controller');

router.post('/', resetSeats)
router.get('/', getSeats);
router.post('/book', bookingSeats);
router.post('/login', login);
router.post('/signup', signup);

module.exports = router;
