import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";


await migrate(db, { migrationsFolder: "drizzle" });
process.exit(0)