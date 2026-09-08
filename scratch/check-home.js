const { MongoClient } = require('mongodb');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)?.[1]?.trim().replace(/^["']|["']$/g, '');
const dbName = env.match(/MONGODB_DB=(.*)/)?.[1]?.trim().replace(/^["']|["']$/g, '') || 'kp_hote_grand_eagle';
const client = new MongoClient(uri);

async function checkHome() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const page = await db.collection('pages').findOne({ slug: 'home' });
    console.log(JSON.stringify(page, null, 2));
  } finally {
    await client.close();
  }
}
checkHome();
