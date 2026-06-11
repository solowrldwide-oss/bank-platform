const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./backend/db.json";
const SECRET = "wallet_secret_key";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* ---------------- LOGIN ---------------- */
app.post("/login", (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.email === req.body.email);

  if (!user) return res.json({ error: "User not found" });

  const ok = bcrypt.compareSync(req.body.password, user.password);
  if (!ok) return res.json({ error: "Wrong password" });

  const token = jwt.sign({ id: user.id }, SECRET);

  res.json({ token, user });
});

/* ---------------- PROFILE ---------------- */
app.get("/me", (req, res) => {
  const db = readDB();
  const token = req.headers.authorization;

  const data = jwt.verify(token, SECRET);
  const user = db.users.find(u => u.id === data.id);

  res.json(user);
});

/* ---------------- TRANSFER ---------------- */
app.post("/transfer", (req, res) => {
  const db = readDB();
  const { fromId, walletId, amount } = req.body;

  const sender = db.users.find(u => u.id === fromId);
  const receiver = db.users.find(u => u.walletId === walletId);

  if (!sender || !receiver) return res.json({ error: "Invalid users" });
  if (sender.balance < amount) return res.json({ error: "Insufficient funds" });

  sender.balance -= amount;
  receiver.balance += amount;

  const tx = {
    id: Date.now(),
    from: sender.name,
    to: receiver.name,
    amount,
    date: new Date().toISOString()
  };

  db.transactions.push(tx);

  writeDB(db);

  res.json({ success: true, tx });
});

/* ---------------- HISTORY ---------------- */
app.get("/transactions", (req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

app.listen(3000, () => console.log("Server running"));