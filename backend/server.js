
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const connectDb=require("./config/connectionDb")
const cors = require("cors")
const PORT=process.env.PORT || 3000
 connectDb()

// ✅ Middleware to parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static images from /public folder
app.use(express.static("public"));

// Routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Start server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
