import express from "express";
import dotenv from "dotenv";
import router from "./routes/user.routes.js";
import mongoose from "mongoose";


const app = express();
dotenv.config();
app.use(express.json());

// Database connection 

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Database connected successfully"))
.catch((err) => console.log("Database connection error: ", err));
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use("/api/v1/users", router);