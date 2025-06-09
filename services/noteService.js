//Appwrite Database and Collectin id
import { ID, Query } from "react-native-appwrite";
import databaseService from "./databaseService";
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_NOTES_ID;

const noteService = {
  // getting all the notes
  async getNotes(userId) {
    if (!userId) {
      console.error("Error: Missing userId in getNotes()");
      return {
        data: [],
        error: "userId is missing",
      };
    }
    try {
      const response = await databaseService.listDocuments(dbId, colId, [
        Query.equal("user_id", userId),
      ]);
      return response;
    } catch (error) {
      console.log("Error fetching the notes", error.message);
      return { data: [], error: error.message };
    }
  },

  // adding a new note
  async addNote(user_id, text) {
    if (!text) {
      return { error: "note text can not be empty" };
    }
    const data = {
      text: text,
      createdAt: new Date().toISOString(),
      user_id: user_id,
    };

    const response = await databaseService.createDocument(
      dbId,
      colId,
      ID.unique(),
      data
    );

    if (response?.error) {
      return { error: response.error };
    }

    return { data: response };
  },

  // updating a note
  async updateNote(id, text) {
    const response = await databaseService.updateDocument(dbId, colId, id, {
      text,
    });
    if (response?.error) {
      return { error: response.error };
    }
    return { data: response };
  },

  // deleting a note
  async deleteNote(id) {
    const response = await databaseService.deleteDocument(dbId, colId, id);
    if (response?.error) {
      return { error: response.error };
    }
    return { success: true };
  },
};

export default noteService;
