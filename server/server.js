const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");  

const connectDatabase = require("./database");

const userRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoute");

dotenv.config({path: 'server/.env'});

connectDatabase();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app //testing