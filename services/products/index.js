const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/products', (req, res) => {
  res.json({ message: 'Welcome to the Products Service!' });
});

app.listen(port, () => {
  console.log(`Products service running on port ${port}`);
});
