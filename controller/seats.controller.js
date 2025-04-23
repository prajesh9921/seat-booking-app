const pool = require('../config/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Auth Code
const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query("INSERT INTO users(email, password) VALUES($1, $2) RETURNING *", [email, hashed]);
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (result.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, result.rows[0].password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, email: email });
};

// Book seats
const bookingSeats = async (req, res) => {
  const { numOfSeats } = req.body;

  if (numOfSeats > 7) {
    return res.status(400).json({ message: 'You can only book up to 7 seats at a time.' });
  }

  try {
    // 1. Fetch all unbooked seats ordered by rownumber and seatnumber
    const result = await pool.query(
      'SELECT * FROM seats WHERE isbooked = false ORDER BY rownumber, seatnumber'
    );
    const available = result.rows;

    if (available.length < numOfSeats) {
      return res.status(400).json({
        message: `Insufficient seats available. Only ${available.length} seats left.`,
      });
    }

    // 2. Dynamically determine total rows from available data
    const allRows = [...new Set(available.map(seat => seat.rownumber))];
    const totalRows = Math.max(...allRows);

    // 3. Priority: Try booking all in a single row
    for (let currentRow = 1; currentRow <= totalRows; currentRow++) {
      const sameRowSeats = available
        .filter(seat => seat.rownumber === currentRow)
        .sort((a, b) => a.seatnumber - b.seatnumber);

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

    // 4. Fallback: Book closest available seats across rows (MODIFIED)
    const closestSeats = [...available].sort((a, b) => {
      if (a.rownumber === b.rownumber) {
        return a.seatnumber - b.seatnumber;
      }
      return a.rownumber - b.rownumber;
    });

    const selectedSeats = closestSeats.slice(0, numOfSeats);
    const selectedIds = selectedSeats.map(seat => seat.id);

    await pool.query(
      'UPDATE seats SET isbooked = true WHERE id = ANY($1)',
      [selectedIds]
    );

    return res.status(200).json({ data: selectedSeats });

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


module.exports = { bookingSeats, resetSeats, getSeats, signup, login };
