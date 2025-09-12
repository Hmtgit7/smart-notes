import { account, databases, COLLECTIONS, DATABASE_ID } from "./appwrite";
import { AppwriteException, ID, Query } from "appwrite";
import type { User } from "@/types";

// Simple rate limiter to prevent excessive API calls
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 60000; // 1 minute

  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

const rateLimiter = new RateLimiter();

export class AuthService {
  async signup(email: string, password: string, name: string) {
    try {
      // Validate input
      if (!email || !password || !name) {
        return { success: false, error: "Email, password, and name are required." };
      }

      if (!email.includes('@')) {
        return { success: false, error: "Please enter a valid email address." };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long." };
      }

      if (name.trim().length < 2) {
        return { success: false, error: "Name must be at least 2 characters long." };
      }

      // Check rate limit
      if (!rateLimiter.canAttempt(`signup:${email}`)) {
        return { success: false, error: "Too many signup attempts. Please wait a minute before trying again." };
      }

      // Create Appwrite account
      const account_response = await account.create(
        ID.unique(),
        email,
        password,
        name.trim(),
      );

      // Create session
      // First, try to delete any existing session
      try {
        await account.deleteSession("current");
        console.log('Existing session deleted during signup');
      } catch (deleteError) {
        console.log('No existing session to delete during signup or error:', deleteError);
      }
      
      await account.createEmailSession(email, password);

      // Create user document in database
      const user = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        {
          userId: account_response.$id,
          name: name.trim(), // Set the name field
          email: email,
          plan: "free",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      );

      // Reset rate limit on successful signup
      rateLimiter.reset(`signup:${email}`);
      return { success: true, user: user as unknown as User };
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof AppwriteException) {
        if (error.code === 409) {
          return { success: false, error: "An account with this email already exists." };
        } else if (error.code === 400) {
          return { success: false, error: "Invalid email or password format." };
        } else if (error.code === 401) {
          return { success: false, error: "Permission denied. Please check your database permissions." };
        } else if (error.code === 404) {
          return { success: false, error: "Database not found. Please check your database configuration." };
        }
        return { success: false, error: error.message };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred during signup",
      };
    }
  }

  async login(email: string, password: string) {
    try {
      // Validate input
      if (!email || !password) {
        return { success: false, error: "Email and password are required." };
      }

      if (!email.includes('@')) {
        return { success: false, error: "Please enter a valid email address." };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long." };
      }

      // Check rate limit
      if (!rateLimiter.canAttempt(`login:${email}`)) {
        return { success: false, error: "Too many login attempts. Please wait a minute before trying again." };
      }

      // Create email session
      console.log('Creating email session for:', email);
      
      // First, try to delete any existing session
      try {
        await account.deleteSession("current");
        console.log('Existing session deleted');
      } catch (deleteError) {
        console.log('No existing session to delete or error:', deleteError);
      }
      
      await account.createEmailSession(email, password);
      console.log('Email session created successfully');
      
      const accountData = await account.get();
      console.log('Account data retrieved:', { id: accountData.$id, email: accountData.email, name: accountData.name });

      // Get user document - if it doesn't exist, create it
      let users;
      try {
        console.log('Querying users collection for userId:', accountData.$id);
        console.log('Database ID:', DATABASE_ID);
        console.log('Collection ID:', COLLECTIONS.USERS);
        
        users = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.equal("userId", accountData.$id)],
        );
        console.log('Users query successful, found documents:', users.documents.length);
      } catch (error) {
        console.error("Error fetching user document:", error);
        if (error instanceof AppwriteException) {
          console.error("Appwrite error details:", { code: error.code, message: error.message, type: error.type });
          if (error.code === 404) {
            return { success: false, error: "Database not found. Please check your database configuration." };
          } else if (error.code === 401) {
            return { success: false, error: "Database access denied. Please check your database permissions." };
          } else if (error.code === 400) {
            return { success: false, error: "Invalid database query. Please check your collection setup." };
          }
        }
        return { success: false, error: "Database connection error. Please check your database setup." };
      }

      if (users.documents.length === 0) {
        // User logged in but no profile exists - create one
        console.log('No user document found, creating new user profile');
        try {
          // Try different field combinations until one works
          const fieldCombinations = [
            // Try 1: Just userId and title
            {
              userId: accountData.$id,
              title: accountData.name || "User",
            },
            // Try 2: Add content field
            {
              userId: accountData.$id,
              title: accountData.name || "User",
              content: "",
            },
            // Try 3: Add all common fields
            {
              userId: accountData.$id,
              title: accountData.name || "User",
              content: "",
              tags: [],
              pinned: false,
              archived: false,
              attachments: [],
              version: 1,
              isDeleted: false,
            },
            // Try 4: Just userId (minimal)
            {
              userId: accountData.$id,
            },
            // Try 5: Just title (if userId is not required)
            {
              title: accountData.name || "User",
            },
          ];

          let userDoc;
          let lastError;

          for (let i = 0; i < fieldCombinations.length; i++) {
            try {
              console.log(`Creating user document with combination ${i + 1}:`, fieldCombinations[i]);
              userDoc = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                ID.unique(),
                fieldCombinations[i],
              );
              console.log(`User document created successfully with combination ${i + 1}:`, userDoc.$id);
              break; // Success! Exit the loop
            } catch (error: any) {
              console.log(`Combination ${i + 1} failed:`, error.message);
              lastError = error;
              if (i === fieldCombinations.length - 1) {
                // This was the last attempt, throw the error
                throw error;
              }
            }
          }
          
          // Reset rate limit on successful login
          rateLimiter.reset(`login:${email}`);
          return { success: true, user: userDoc as unknown as User };
        } catch (createError) {
          console.error("Error creating user document:", createError);
          if (createError instanceof AppwriteException) {
            console.error("Appwrite create error details:", { 
              code: createError.code, 
              message: createError.message, 
              type: createError.type 
            });
            if (createError.code === 401) {
              return { success: false, error: "Permission denied. Please check your database permissions." };
            } else if (createError.code === 400) {
              return { success: false, error: `Invalid user data: ${createError.message}. Please check your collection attributes.` };
            } else if (createError.code === 404) {
              return { success: false, error: "Collection not found. Please check your collection setup." };
            }
          }
          return { success: false, error: "Could not create user profile. Please check database permissions." };
        }
      }

      // Reset rate limit on successful login
      rateLimiter.reset(`login:${email}`);
      return { success: true, user: users.documents[0] as unknown as User };
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AppwriteException) {
        if (error.code === 401) {
          return { success: false, error: "Invalid email or password." };
        } else if (error.code === 429) {
          return { success: false, error: "Rate limit exceeded. Please wait a few minutes before trying again." };
        } else if (error.code === 400) {
          return { success: false, error: "Invalid email or password format." };
        } else if (error.code === 404) {
          return { success: false, error: "Project not found. Please check your Appwrite configuration." };
        }
        return { success: false, error: error.message };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred during login",
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

      if (users.documents.length > 0) {
        const userData = users.documents[0] as unknown as User;
        
        // Ensure the name field is properly set
        if (!userData.name && userData.title) {
          userData.name = userData.title;
        } else if (!userData.name) {
          userData.name = accountData.name || "User";
        }
        
        return userData;
      } else {
        // User is authenticated but no profile exists - create one
        try {
          const userDoc = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
              userId: accountData.$id,
              name: accountData.name || "User", // Set the name field
              email: accountData.email || "",
              plan: "free",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          );
          return userDoc as unknown as User;
        } catch (createError) {
          console.error("Error creating user document:", createError);
          return null;
        }
      }
    } catch (error) {
      // If user is not authenticated, this is expected - return null
      if (error instanceof AppwriteException && error.code === 401) {
        return null;
      }
      console.error("Error getting current user:", error);
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
