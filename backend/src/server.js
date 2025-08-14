const { migrate } = require('./db');
const app = require('./app');
const PORT = process.env.PORT || 5000;

migrate()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
