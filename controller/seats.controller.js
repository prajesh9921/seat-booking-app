const pool = require('../config/db');

// Book seats
const bookingSeats = async (req, res) => {
  const { numOfSeats } = req.body;

  if (numOfSeats > 7) {
    return res.status(400).json({ message: 'You can only book up to 7 seats at a time.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM seats WHERE isbooked = false ORDER BY rownumber, seatnumber'
    );
    const available = result.rows;

    if (available.length < numOfSeats) {
      return res.status(400).json({
        message: `Insufficient seats available. Only ${available.length} seats left.`,
      });
    }

    const totalRows = 12;

    // Try to find all seats in a single row
    for (let currentRow = 1; currentRow <= totalRows; currentRow++) {
      const sameRowSeats = available.filter(seat => seat.rownumber === currentRow);
      if (sameRowSeats.length >= numOfSeats) {
        const selected = sameRowSeats.slice(0, numOfSeats);
        const seatIds = selected.map(seat => seat.id);

        await pool.query(
          'UPDATE seats SET isbooked = true WHERE id = ANY($1)',
          [seatIds]
        );

        return res.status(200).json({ data: selected });
      }
    }

    // combine adjacent rows
    const seatCountsPerRow = [];
    for (let r = 1; r <= totalRows; r++) {
      seatCountsPerRow.push(
        available.filter(seat => seat.rownumber === r).length
      );
    }

    let bestRange = { start: -1, end: -1, length: Infinity };
    let left = 0, right = 0, countSum = 0;

    while (right < seatCountsPerRow.length) {
      countSum += seatCountsPerRow[right];

      while (countSum >= numOfSeats) {
        const windowLength = right - left + 1;
        if (windowLength < bestRange.length) {
          bestRange = { start: left, end: right, length: windowLength };
        }
        countSum -= seatCountsPerRow[left];
        left++;
      }

      right++;
    }

    const nearbySeats = [];
    for (let r = bestRange.start + 1; r <= bestRange.end + 1; r++) {
      nearbySeats.push(
        ...available.filter(seat => seat.rownumber === r)
      );
    }

    const finalSeats = nearbySeats.slice(0, numOfSeats);
    const finalIds = finalSeats.map(seat => seat.id);

    await pool.query(
      'UPDATE seats SET isbooked = true WHERE id = ANY($1)',
      [finalIds]
    );

    return res.status(200).json({ data: finalSeats });

  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ message: 'Something went wrong while booking seats.' });
  }
};


// Get all seats
const getSeats = async (req, res) => {
  try {
    const { rows: seats } = await pool.query('SELECT * FROM seats ORDER BY rownumber, seatnumber');
    return res.status(200).json({ availableSeats: seats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Reset all seats

const resetSeats = async (req, res) => {
  try {
    // Clear all existing seat records
    await pool.query('DELETE FROM seats');

    const rows = 12;
    const seatsPerRow = 7;
    const totalSeats = 80;
    let seatCounter = 1;
    const valuesToInsert = [];

    for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
      const seatsThisRow = rowIndex === rows ? totalSeats % seatsPerRow : seatsPerRow;

      for (let seat = 1; seat <= seatsThisRow; seat++) {
        valuesToInsert.push(`(${seatCounter}, false, ${rowIndex})`);
        seatCounter++;
      }
    }

    const insertStatement = `
      INSERT INTO seats (seatnumber, isbooked, rownumber)
      VALUES ${valuesToInsert.join(', ')}
    `;

    await pool.query(insertStatement);

    return res.status(200).json({ message: 'Seat data has been reset successfully.' });

  } catch (err) {
    console.error('Error resetting seats:', err);
    return res.status(500).json({ message: 'Server error while resetting seats.' });
  }
};


module.exports = { bookingSeats, resetSeats, getSeats };
