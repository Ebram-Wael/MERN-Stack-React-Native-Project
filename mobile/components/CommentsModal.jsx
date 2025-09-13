import React, { useEffect, useCallback, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import COLORS from "../constants/colors";
import styles from "../assets/styles/CommentModal.style";

const CommentsModal = ({ visible, onClose, bookId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.1.3:3000/api/comments/${bookId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch comments");
      }
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (visible) {
      fetchComments();
    }
  }, [visible, fetchComments]);

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.user}>{item.user?.userName || "Anonymous"}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.commentTime}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.modalContent}>
        <Text style={styles.title}>Comments</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : comments.length === 0 ? (
          <Text style={styles.noComments}>No comments yet.</Text>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderComment}
          />
        )}

        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default CommentsModal;
