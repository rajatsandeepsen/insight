import { db } from "./index";
import { user } from './schema'

const allUsers = await db.select().from(user);

console.log(allUsers)