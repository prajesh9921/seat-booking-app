const express = require("express");
const seatsRoutes = require("./routes/seats.routes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/seats", seatsRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
