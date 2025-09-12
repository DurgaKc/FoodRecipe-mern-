
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

app.use(cors())

// Serve images statically
app.use(express.static("public"))

app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))

app.listen(PORT,(env)=>{
    console.log(`app is running on port ${PORT}`)
})