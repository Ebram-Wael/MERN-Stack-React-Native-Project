import { View, Text } from "react-native";
import useAuthStore from "../store/authStore";
import styles from "../assets/styles/profile.styles";
import { Image } from "expo-image";
import React from "react";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  if (!user) return null;
  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.userName}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>
          Member since {user.createdAt.split("T")[0]}
        </Text>
      </View>
    </View>
  );
}
