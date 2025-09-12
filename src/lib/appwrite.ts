import { Client, Databases, Account, Storage, Functions } from "appwrite";

// Validate required environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!endpoint) {
  console.error('NEXT_PUBLIC_APPWRITE_ENDPOINT is required');
  throw new Error('Appwrite endpoint is not configured. Please check your environment variables.');
}
if (!projectId) {
  console.error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is required');
  throw new Error('Appwrite project ID is not configured. Please check your environment variables.');
}
if (!databaseId) {
  console.error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is required');
  throw new Error('Appwrite database ID is not configured. Please check your environment variables.');
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const DATABASE_ID = databaseId;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

// Collection IDs
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID || 'users',
  NOTES: process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID || 'notes',
  VERSIONS: process.env.NEXT_PUBLIC_VERSIONS_COLLECTION_ID || 'versions',
  AI_ENHANCEMENTS: process.env.NEXT_PUBLIC_AI_ENHANCEMENTS_COLLECTION_ID || 'ai_enhancements',
};

export { client };
