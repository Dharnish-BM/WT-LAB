const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 5000;
const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Connect to MongoDB once and reuse connection
async function connectDB() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
        console.log("Connected to MongoDB");
    }
    return client.db("form");
}

// Serve index.html on root access
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register User (Save to MongoDB)
app.post("/register", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("details");
        const result = await collection.insertOne(req.body);
        res.status(201).json({ success: true, insertedId: result.insertedId });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});