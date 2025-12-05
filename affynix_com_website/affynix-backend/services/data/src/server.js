const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'data-service' });
});

app.listen(PORT, () => {
  console.log(`Data service running on port ${PORT}`);
});
