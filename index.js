const express = require("express");
const dotenv = require("dotenv");
const problems = require("./routes/problems");
const database = require("./config/database");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001'
}))
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;


database.connect();

app.use("/api/problem", problems);

app.listen(port,() => {
  console.log(`Server running on port ${port}`);
});
