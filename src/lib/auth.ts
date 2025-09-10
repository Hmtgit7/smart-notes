import { account, databases, COLLECTIONS, DATABASE_ID } from "./appwrite";
import { AppwriteException, ID, Query } from "appwrite";
import type { User } from "@/types";

export class AuthService {
  async signup(email: string, password: string, name: string) {
    try {
      // Create Appwrite account
      const account_response = await account.create(
        ID.unique(),
        email,
        password,
        name,
      );

      // Create session
      await account.createEmailSession(email, password);

      // Create user document in database
      const user = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        {
          userId: account_response.$id,
          name,
          email,
          theme: "system",
          plan: "free",
        },
      );

      return { success: true, user };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error:
          error instanceof AppwriteException
            ? error.message
            : "An error occurred during signup",
      };
    }
  }

  async login(email: string, password: string) {
    try {
      await account.createEmailSession(email, password);
      const accountData = await account.get();

      // Get user document
      const users = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal("userId", accountData.$id)],
      );

      if (users.documents.length === 0) {
        throw new Error("User profile not found");
      }

      return { success: true, user: users.documents[0] as unknown as User };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error instanceof AppwriteException
            ? error.message
            : "An error occurred during login",
      };
    }
  }

  async logout() {
    try {
      await account.deleteSession("current");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Failed to logout" };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const accountData = await account.get();

      const users = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal("userId", accountData.$id)],
      );

      return users.documents.length > 0 ? (users.documents[0] as unknown as User) : null;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        updates,
      );
      return { success: true, user: updatedUser as unknown as User };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: "Failed to update profile" };
    }
  }
}

export const authService = new AuthService();
