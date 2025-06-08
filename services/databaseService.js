import { database } from "./appwrite";

const databaseService = {
  // getting the documents
  async listDocuments(dbId, colId) {
    try {
      const response = await database.listDocuments(dbId, colId);
      return response.documents || [];
    } catch (error) {
      console.log("Error fetching documents:", error.message);
      return { error: error.message };
    }
  },
  // creating a document
  async createDocument(dbId, colId, id = null, data) {
    try {
      const response = await database.createDocument(
        dbId,
        colId,
        id || undefined,
        data
      );
      return response;
    } catch (error) {
      console.log("error creating the document", error.message);
      return { error: error.message };
    }
  },

  // updating a document
  async updateDocument(dbId, colId, id, data) {
    try {
      if (!id) {
        throw new Error("Document ID is required for update");
      }
      const response = await database.updateDocument(dbId, colId, id, data);
      return response;
    } catch (error) {
      console.log("Update document error:", error.message);
      return { error: error.message };
    }
  },

  // deleting a document
  async deleteDocument(dbId, colId, id) {
    try {
      await database.deleteDocument(dbId, colId, id);
      return { success: true };
    } catch (error) {
      console.log("error", error.message);
      return { error: error.message };
    }
  },
};

export default databaseService;
