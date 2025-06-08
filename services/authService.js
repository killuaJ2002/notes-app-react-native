import { ID } from "react-native-appwrite";
import { account } from "./appwrite";

const authService = {
  // Register a user
  async register(email, password) {
    try {
      const response = await account.create(ID.unique(), email, password);
      return response;
    } catch (error) {
      return {
        error: error.message || "Registration failed, please try again.",
      };
    }
  },

  // User login
  async login(email, password) {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password
      );
      return response;
    } catch (error) {
      return {
        error: error.message || "Login failed, please check your credentials.",
      };
    }
  },

  // Get logged in user
  async getUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Logout user
  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      return {
        error: error.message || "Logout failed, please try again later.",
      };
    }
  },
};

export default authService;
