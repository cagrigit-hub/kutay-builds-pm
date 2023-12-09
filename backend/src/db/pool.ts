import { Pool } from "pg";

var pool: Pool | null = null;
try {
  pool = new Pool({
    user: "kty",
    password: "secretpass",
    host: "localhost",
    port: 5432, // default PostgreSQL port
    database: "passman",
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait for a connection to become available
  });
} catch (error) {
  throw error;
}

export default pool;
