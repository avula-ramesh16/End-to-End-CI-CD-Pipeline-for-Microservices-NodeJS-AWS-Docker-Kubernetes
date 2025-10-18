const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/users', (req, res) => {
  res.json({ message: 'Welcome to the Users Service!' });
});

app.listen(port, () => {
  console.log(`Users service running on port ${port}`);
});
