const { MongoClient } = require('mongodb');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)?.[1]?.trim().replace(/^["']|["']$/g, '');
const dbName = env.match(/MONGODB_DB=(.*)/)?.[1]?.trim().replace(/^["']|["']$/g, '') || 'kp_hote_grand_eagle';
const client = new MongoClient(uri);

async function checkLegalPages() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const pages = await db.collection('pages').find({ slug: { $in: ['terms-and-conditions', 'privacy-policy'] } }).toArray();
    console.log(JSON.stringify(pages, null, 2));
  } finally {
    await client.close();
  }
}
checkLegalPages();
