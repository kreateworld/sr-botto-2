import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const maxRetries = 3;
  let currentTry = 0;

  while (currentTry < maxRetries) {
    try {
      const connection = postgres(process.env.DATABASE_URL, { 
        ssl: {
          rejectUnauthorized: false
        },
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        prepare: false
      });
      
      const db = drizzle(connection);

      console.log('Running migrations...');
      await migrate(db, { migrationsFolder: 'drizzle' });
      console.log('Migrations completed successfully');
      
      await connection.end();
      process.exit(0);
    } catch (error) {
      currentTry++;
      console.error(`Migration attempt ${currentTry} failed:`, error);
      
      if (currentTry === maxRetries) {
        console.error('All migration attempts failed');
        process.exit(1);
      }
      
      // Wait before retrying
      console.log(`Retrying in 5 seconds...`);
      await sleep(5000);
    }
  }
};

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});