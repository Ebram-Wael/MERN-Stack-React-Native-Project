/* eslint-disable import/no-unresolved */
import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLORS from "../../constants/colors";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import useAuthStore from "../../store/authStore";

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token, user } = useAuthStore();

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!"
          );
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 0.2,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error picking image", "Please try again later.");
    }
  };

  const renderRatingStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setRating(i)}
            style={styles.starButton}
          >
            <Ionicons
              name={i <= rating ? "star" : "star-outline"}
              size={20}
              color={i <= rating ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSubmit = async () => {
    if (!title || !caption || !image || !rating) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }
    if (!token || !user?._id) {
      Alert.alert("Error", "User not logged in!");
      return;
    }

    try {
      setLoading(true);

      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch("http://192.168.1.3:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,
          rating,
          image: imageDataUrl,
          userId: user._id, // ✅ بعت الـ id بس
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      Alert.alert("Success", "Book recommendation added successfully!");
      setTitle("");
      setCaption("");
      setRating(3);
      setImage(null);
      setImageBase64(null);
      router.push("/");
    } catch (error) {
      console.error("Error submitting book recommendation:", error);
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token || !user?._id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.textSecondary }}>
          You need to log in first
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        {/* Header */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your fav reads with others
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Book Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Title</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="book-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter book title"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Rating */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Rating</Text>
            {renderRatingStars()}
          </View>

          {/* Book Image */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons
                    name="image-outline"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.placeholderText}>
                    Tap to select an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Caption */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Caption</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textArea}
                value={caption}
                onChangeText={setCaption}
                placeholder="Enter a caption"
                placeholderTextColor={COLORS.textSecondary}
                multiline
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Share</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
