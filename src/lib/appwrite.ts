// import { Client, Account, Databases } from "appwrite";

// const client = new Client()
//   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
//   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// const account = new Account(client);
// const databases = new Databases(client);

// export { client, account, databases };
import { Client, Databases, Account, Storage, Functions } from "appwrite";

// Provide fallback values for build time when env vars might be undefined
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'default-project';

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'default-database';
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'default-bucket';

// Collection IDs
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID || 'users',
  NOTES: process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID || 'notes',
  VERSIONS: process.env.NEXT_PUBLIC_VERSIONS_COLLECTION_ID || 'versions',
  AI_ENHANCEMENTS: process.env.NEXT_PUBLIC_AI_ENHANCEMENTS_COLLECTION_ID || 'ai_enhancements',
};

export { client };
