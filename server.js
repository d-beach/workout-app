import express from "express"
import bodyParser from "body-parser"
import db from "./db.js"
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const app = express();

app.set("view engine", "ejs");

const port = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// Log a new push-up
app.post('/log-push-up', (req, res) => {
  const { count } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const sql = 'INSERT INTO pushups (date, count) VALUES (?, ?)';
  db.query(sql, [date, count], (err) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to log push-up' });
      }
      res.json({ message: 'Push-up logged successfully' });
  });
});

// Log a new sit-up
app.post('/log-sit-up', (req, res) => {
  const { count } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const sql = 'INSERT INTO situps (date, count) VALUES (?, ?)';
  db.query(sql, [date, count], (err) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to log sit-up' });
      }
      res.json({ message: 'Sit-up logged successfully' });
  });
});

// Get the daily push-up count
app.get('/push-ups', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = 'SELECT SUM(count) AS total FROM pushups WHERE date LIKE ?';
  db.query(sql, [today + '%'], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to fetch push-up data' });
      }
      const total = rows[0] ? rows[0].total : 0;
      res.json({ dailyCount: total });
  });
});

// Get the daily sit-up count
app.get('/sit-ups', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = 'SELECT SUM(count) AS total FROM situps WHERE date LIKE ?';
  db.query(sql, [today + '%'], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to fetch sit-up data' });
      }
      const total = rows[0] ? rows[0].total : 0;
      res.json({ dailyCount: total });
  });
});

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});