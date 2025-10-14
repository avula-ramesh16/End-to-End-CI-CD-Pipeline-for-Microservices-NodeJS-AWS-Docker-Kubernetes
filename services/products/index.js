const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'products' }));
app.get('/products', (req, res) => res.json([{ id: 1, name: 'Laptop' }]));

app.listen(port, () => console.log(`Products service running on ${port}`));
