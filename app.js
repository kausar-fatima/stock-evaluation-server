const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/error.middleware"); // Import the errorHandler
const cleanupJob = require('./services/cleanup'); // Import the cleanup job

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://fatima:h6vsug97PG8wCaEi@cluster0.pxi3xec.mongodb.net/stockDatabase")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use("/api", authRoutes);
app.use(errorHandler); // Use the errorHandler middleware

// Initialize the cleanup job
cleanupJob;
