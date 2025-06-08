import AddNoteModal from "@/components/AddNoteModal";
import NoteList from "@/components/NoteList";
import { useAuth } from "@/contexts/AuthContext";
import noteService from "@/services/noteService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const NoteScreen = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    const response = await noteService.getNotes();
    if (response.error) {
      setError(response.error);
      Alert.alert("Error", response.error);
    } else {
      const formatted = response.data.map((doc) => ({
        // formatted data is an array of objects having keys id and text
        id: doc.$id, // 🔁 convert $id to id
        text: doc.text,
      }));
      setNotes(formatted);
      setError(null);
    }
    setLoading(false);
  };

  const addNote = async () => {
    if (newNote.trim() === "") return;
    const response = await noteService.addNote(newNote);
    if (response.error) {
      Alert.alert("Error", response.error);
    } else {
      const formatted = {
        id: response.data.$id,
        text: response.data.text,
      };
      setNotes([...notes, formatted]);
    }
    setNewNote("");
    setModalVisible(false);
  };

  const deleteNote = async (id) => {
    Alert.alert("Delete Note", "Do you want to delete this note?", [
      {
        text: "Cancel",
        style: "Cancel",
      },
      {
        text: "Delete",
        style: "Delete",
        onPress: async () => {
          try {
            const response = await noteService.deleteNote(id);
            if (response.error) {
              Alert.alert("Error", response.error);
            } else {
              setNotes(notes.filter((note) => note.id !== id));
            }
          } catch (err) {
            Alert.alert("Error", "An unexpected error occurred.");
          }
        },
      },
    ]);
  };

  const editNote = async (id, newText) => {
    if (!newText.trim()) {
      Alert.alert("error", "Note text can not be empty");
      return;
    }
    const response = await noteService.updateNote(id, newText);
    if (response.error) {
      Alert.alert("error", response.error);
    } else {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id ? { ...note, text: response.data.text } : note
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
        </>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>
      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNote={newNote}
        setNewNote={setNewNote}
        addNote={addNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
});

export default NoteScreen;
