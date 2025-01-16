const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
