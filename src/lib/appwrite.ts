// import { Client, Account, Databases } from "appwrite";

// const client = new Client()
//   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
//   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// const account = new Account(client);
// const databases = new Databases(client);

// export { client, account, databases };
import { Client, Databases, Account, Storage, Functions } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

// Collection IDs
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
  NOTES: process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID!,
  VERSIONS: process.env.NEXT_PUBLIC_VERSIONS_COLLECTION_ID!,
  AI_ENHANCEMENTS: process.env.NEXT_PUBLIC_AI_ENHANCEMENTS_COLLECTION_ID!,
};

export { client };
