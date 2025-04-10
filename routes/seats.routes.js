const express = require('express');
const router = express.Router();
const { bookingSeats, resetSeats, getSeats } = require('../controller/seats.controller');

router.post('/', resetSeats)
router.get('/', getSeats);
router.post('/book', bookingSeats);

module.exports = router;
