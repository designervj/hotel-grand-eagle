import { MongoClient, Db, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local!");
}

const uri = process.env.MONGODB_URI;
const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoClientUri: string | undefined;
}

let prodClientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  const currentUri = process.env.MONGODB_URI;
  if (!currentUri) {
    throw new Error("Please add MONGODB_URI to .env.local!");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise || global._mongoClientUri !== currentUri) {
      const client = new MongoClient(currentUri, options);
      global._mongoClientUri = currentUri;
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!prodClientPromise) {
      const client = new MongoClient(currentUri, options);
      prodClientPromise = client.connect();
    }
    return prodClientPromise;
  }
}

export const clientPromise = {
  then: <TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ) => getClientPromise().then(onfulfilled, onrejected),
  catch: <TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ) => getClientPromise().catch(onrejected)
} as unknown as Promise<MongoClient>;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;

  if (!process.env.MONGODB_DB) {
    throw new Error("MONGODB_DB not defined in .env");
  }

  return client.db(process.env.MONGODB_DB);
}

export async function getTestDatabase(dbname: string): Promise<Db> {
  const client = await clientPromise;

  if (!dbname) {
    throw new Error("No DB Name Found");
  }

  return client.db(dbname);
}

// Backward-compatible alias
export const getDb = getDatabase;

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

export function fromObjectId(id: ObjectId): string {
  return id.toString();
}
