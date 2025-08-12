import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.100.210:3000";

export default function TeamScreen() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("Error", "Please log in to access this feature.");
          return;
        }

        const response = await axios.get(`${API_URL}/teams`);
        const teams = response.data.filter((team) =>
          team.members.includes(userId)
        );
        const memberIds = teams.flatMap((team) => team.members);
        const uniqueMemberIds = [...new Set(memberIds)];

        const members = await Promise.all(
          uniqueMemberIds.map(async (id) => {
            const userRes = await axios.get(`${API_URL}/users/${id}`);
            return userRes.data;
          })
        );
        setTeamMembers(members);
      } catch (error) {
        Alert.alert("Error", "Failed to load team members.");
        console.error(error);
      }
    };
    loadTeam();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Team</Text>
      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>{item.username}</Text>
            <Text style={styles.memberEmail}>{item.email}</Text>
            <Text style={styles.memberPhone}>{item.phone}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No team members found</Text>
          </View>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A8A",
    padding: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  memberCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  memberEmail: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  memberPhone: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "600",
  },
});
