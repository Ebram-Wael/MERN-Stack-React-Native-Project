/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import styles from "../../assets/styles/profile.styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLORS from "../../constants/colors";
import useAuthStore from "../../store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";

export default function Profile() {
  const [books, setBooks] = useState([]);
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    if (!user?._id || !token) return;
    try {
      setLoading(true);

      const response = await fetch(
        `http://192.168.1.3:3000/api/books/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setBooks(data.books || []);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load books");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id && token) {
      fetchData();
    }
  }, [user, token]);

  const confirmDelete = (bookId) => {
    if (!bookId) return;
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBook(bookId),
        },
      ]
    );
  };

  const deleteBook = async (bookId) => {
    if (!bookId || !token) return;
    try {
      const response = await fetch(
        `http://192.168.1.3:3000/api/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      Alert.alert("Success", "Book deleted successfully");
      fetchData();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete book");
    }
  };

  const renderRatingStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color={i <= rating ? COLORS.primary : COLORS.textSecondary}
        />
      );
    }
    return stars;
  };

  const renderBookItem = ({ item }) => {
    if (!item) return null;
    return (
      <View style={styles.bookItem}>
        <Image source={item.image || null} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title || "Untitled"}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.bookCaption}>
            {item.caption || "No description"}
          </Text>
          <Text style={styles.bookDate}>
            Shared on {item.createdAt ? item.createdAt.split("T")[0] : "Unknown"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => item?._id && confirmDelete(item._id)}
        >
          <Ionicons name="trash-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!token || !user?._id) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.textSecondary }}>
          Please log in to view your profile.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your recommendations 📚</Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={renderBookItem}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchData();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add Your first book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
