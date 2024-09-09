const express = require("express");
const dotenv = require("dotenv");
const problems = require("./routes/problems");
const execute = require("./routes/judge");
const user = require("./routes/user");
const database = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use(express.urlencoded({ extended: true }));


app.post('/webhook', (req, res) => {
  console.log('Code execution result received:', req.body);
  res.status(200).send('Result received');
});

const port = process.env.PORT || 3000;

database.connect();

app.use("/api/problem", problems);
app.use("/api",execute);
app.use("/user", user);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
