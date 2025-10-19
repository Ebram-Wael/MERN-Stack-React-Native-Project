/* eslint-disable import/no-unresolved */
import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import useAuthStore from "../store/authStore";
import COLORS from "../constants/colors";

const AddComment = ({ bookId }) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuthStore();

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.3:3000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: commentText,
          user: user._id,
          book: bookId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to add comment");
        return;
      }
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.container}>
        <TextInput
          style={[
            styles.input,
            { borderColor: commentText ? COLORS.primary : COLORS.border },
          ]}
          placeholder="Add comment here"
          placeholderTextColor={COLORS.placeholderText}
          value={commentText}
          onChangeText={setCommentText}
        />
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: commentText
                ? COLORS.primary
                : COLORS.textSecondary,
            },
          ]}
          onPress={handleSubmit}
          disabled={!commentText.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Ionicons name="send" size={22} color={COLORS.white} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddComment;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: COLORS.inputBackground,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 45,
    minHeight: 45,
  },
});
