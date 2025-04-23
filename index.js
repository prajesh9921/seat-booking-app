const express = require("express");
const seatsRoutes = require("./routes/seats.routes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const allowedOrigins = ['http://localhost:3000', 'https://bookseatapp.netlify.app'];

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use("/api/seats", seatsRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
