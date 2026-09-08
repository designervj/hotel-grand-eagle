import { MongoClient } from 'mongodb';

import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const mongoUriMatch = envFile.match(/MONGODB_URI=(.*)/);
const mongoDbMatch = envFile.match(/MONGODB_DB=(.*)/);

const MONGODB_URI = mongoUriMatch ? mongoUriMatch[1].trim().replace(/^"|"$/g, '') : null;
const MONGODB_DB = mongoDbMatch ? mongoDbMatch[1].trim().replace(/^"|"$/g, '') : null;

console.log("DB:", MONGODB_DB);

if (MONGODB_URI) {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const users = await db.collection('users').find({}).sort({_id: -1}).limit(5).toArray();
  fs.writeFileSync('db_out.json', JSON.stringify(users, null, 2));
  console.log("Wrote to db_out.json");
  await client.close();
}
