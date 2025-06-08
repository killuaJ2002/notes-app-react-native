//Appwrite Database and Collectin id
import { ID } from "react-native-appwrite";
import databaseService from "./databaseService";
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_NOTES_ID;

const noteService = {
  // getting all the notes
  async getNotes() {
    const response = await databaseService.listDocuments(dbId, colId);
    if (response.error) {
      return { error: error.message };
    }
    return { data: response }; // response is an array of objects having different id values and text
  },

  // adding a new note
  async addNote(text) {
    if (!text) {
      return { error: "note text can not be empty" };
    }
    const data = {
      text: text,
      createdAt: new Date().toISOString(),
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
