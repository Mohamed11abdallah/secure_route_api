const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const corsOptions = {
  origin: "http://example.com",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const API_KEY = "123456789";

// Middleware pour vérifier la clé API
function checkApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (apiKey && apiKey === API_KEY) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Accès refusé : clé API manquante ou invalide" });
  }
}

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello world" });
});

app.get("/api/private-data", checkApiKey, (req, res) => {
  res.json({ data: "Here is some private data" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
