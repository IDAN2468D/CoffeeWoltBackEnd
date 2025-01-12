const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = '192.168.1.191';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
