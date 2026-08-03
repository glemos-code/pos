import { createApp } from './app.js';
import { testDatabaseConnection } from './db/pool.js';

const port = Number(process.env.API_PORT || process.env.PORT || 3334);
const app = createApp();

async function start() {
  try {
    await testDatabaseConnection();
    console.log('Database connection OK.');

    app.listen(port, () => {
      console.log(`API listening on port ${port}.`);
    });
  } catch (error) {
    console.error('Failed to connect to the database on startup.');
    console.error(error);
    process.exit(1);
  }
}

start();
