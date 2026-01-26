const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS, etc.) from the current directory
app.use(express.static(__dirname));

// Optional: A simple route to serve your main HTML file if not using `express.static`
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to save income data
app.post('/api/save-income', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');

  // Read existing data
  let data = {};
  if (fs.existsSync(dataPath)) {
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      data = fileContent ? JSON.parse(fileContent) : {};
    } catch (err) {
      data = {};
    }
  }

  // Update with new data - use person to identify whose income
  const person = req.body.person || 'unknown';
  if (!data.incomes) {
    data.incomes = {};
  }
  data.incomes[person] = {
    amount: req.body.amount,
    lastUpdated: new Date().toISOString()
  };

  // Write back to file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.json({ success: true, data });
});

// API endpoint to get income data
app.get('/api/get-income', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');

  if (fs.existsSync(dataPath)) {
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      const data = fileContent ? JSON.parse(fileContent) : {};
      res.json(data);
    } catch (err) {
      res.json({});
    }
  } else {
    res.json({});
  }
});

app.listen(port, () => {
  console.log(`Web app running at http://localhost:${port}`);
});

// API endpoint to save setup data
app.post('/api/setup', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');

  // Read existing data
  let data = {};
  if (fs.existsSync(dataPath)) {
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      data = fileContent ? JSON.parse(fileContent) : {};
    } catch (err) {
      data = {};
    }
  }

  // Get the person's name from the request
  const personName = req.body.name;
  if (!personName) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }

  // Create setup object if it doesn't exist
  if (!data.setup) {
    data.setup = {};
  }

  // Save setup data under the person's name
  data.setup[personName.toLowerCase()] = {
    ...req.body,
    lastUpdated: new Date().toISOString()
  };

  // Write back to file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.json({ success: true, data });
});

// API endpoint to get setup data
app.get('/api/get-setup', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');

  if (fs.existsSync(dataPath)) {
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      const data = fileContent ? JSON.parse(fileContent) : {};
      res.json(data);
    } catch (err) {
      res.json({});
    }
  } else {
    res.json({});
  }
});