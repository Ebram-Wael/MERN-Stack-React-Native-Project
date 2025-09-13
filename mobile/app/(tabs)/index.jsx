/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../../assets/styles/home.styles";
import useAuthStore from "../../store/authStore";
import CommentsModal from "../../components/CommentsModal";
import AddComment from "../../components/AddComment";
import COLORS from "../../constants/colors";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const PAGE_LIMIT = 2;

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeBookId, setActiveBookId] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const { token, user } = useAuthStore();

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    if (!token) return;
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(
        `http://192.168.1.3:3000/api/books?page=${pageNum}&limit=${PAGE_LIMIT}`,
        {
          method: "GET",
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

      const mergedBooks =
        refresh || pageNum === 1 ? data.books : [...books, ...data.books];

      const uniqueBooks = Array.from(
        new Map(mergedBooks.map((b) => [b?._id, b])).values()
      );

      setBooks(uniqueBooks);
      setHasMore(pageNum < (data.totalPages || 1));
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", error.message || "Failed to load books");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token && user) fetchBooks();
  }, [token]);

  const handleRefresh = async () => {
    await fetchBooks(1, true);
  };

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await sleep(500);
      await fetchBooks(page + 1);
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

  const renderItem = ({ item }) => {
    if (!item) return null;

    const userInfo = item.user || {};
    const bookDate = item.createdAt
      ? item.createdAt.split("T")[0]
      : "Unknown date";

    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image
              source={userInfo.profileImage ? { uri: userInfo.profileImage } : null}
              style={styles.avatar}
            />
            <Text style={styles.username}>{userInfo.userName || "Anonymous"}</Text>
          </View>
        </View>

        <View style={styles.bookImageContainer}>
          <Image
            source={item.image ? { uri: item.image } : null}
            style={styles.bookImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title || "Untitled"}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.caption}>{item.caption || "No description"}</Text>
          <Text style={styles.date}>Shared on {bookDate}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", width: "97%" }}>
          <TouchableOpacity
            onPress={() => {
              if (item?._id) {
                setActiveBookId(item._id);
                setShowCommentsModal(true);
              }
            }}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          {item?._id && <AddComment bookId={item._id} />}
        </View>
      </View>
    );
  };

  if (loading)
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  if (!token)
    return (
      <View style={styles.container}>
        <Text style={{ color: COLORS.textSecondary }}>
          Please log in to see books.
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm 🦉</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View>
            <Ionicons name="book-outline" size={60} color={COLORS.primary} />
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a book!
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />

      <CommentsModal
        visible={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        bookId={activeBookId}
      />
    </View>
  );
}
