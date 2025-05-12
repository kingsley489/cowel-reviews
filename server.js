const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const { v4: uuidv4 } = require("uuid"); // Add at the top

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors()); // allow cross-origin requests
app.use(bodyParser.json()); // parse JSON request bodies

// In-memory store for reviews
let reviews = [];

// GET all reviews
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

// POST a new review
app.post("/api/reviews", (req, res) => {
  const { name, rating, text, date } = req.body;
  if (!name || !text) {
    return res
      .status(400)
      .json({ error: "Name and review text are required." });
  }
  const newReview = {
    id: uuidv4(), // 👈 Adds a unique ID to each review
    name,
    rating,
    text,
    date,
  };

  reviews.unshift(newReview);
  res.status(201).json(newReview);
});

// DELETE a review by ID
app.delete("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== "Collins1975") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Review not found" });
  }

  reviews.splice(index, 1);
  res.status(204).end();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  next();
});
app.use(cors());

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
