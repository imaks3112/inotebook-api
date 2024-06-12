const connectToDB = require("./db");
const express = require("express");
const cors = require('cors');

connectToDB();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Serve start on port http://localhost:${port}`);
});
