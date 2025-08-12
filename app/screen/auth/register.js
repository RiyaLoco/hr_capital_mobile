const React = require("react");
const { useState } = React;
const {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} = require("react-native");
const axios = require("axios");
const AsyncStorage =
  require("@react-native-async-storage/async-storage").default;
const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !phoneNumber || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await axios.get(
        `http://192.168.100.210:3000/users?email=${email}`
      );
      if (res.data.length > 0) {
        Alert.alert("Error", "User already exists");
        return;
      }

      // POST new user to JSON Server
      await axios.post("http://192.168.100.210:3000/users", {
        username,
        phone: phoneNumber,
        email,
        password,
      });

      Alert.alert("Success", "Registration successful");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.appTitle}>HR Capital</Text>
            <Text style={styles.subtitle}>Sign up to continue</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#c1c1c1ff"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#c1c1c1ff"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#c1c1c1ff"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#c1c1c1ff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                Already have an account?{" "}
                <Text style={styles.registerLinkText}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7FA",
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  registerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#4B5563",
  },
  registerLinkText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});

export default Register;
