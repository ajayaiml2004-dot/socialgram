import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eye, EyeOff } from "lucide-react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  const handleLogin = async () => {
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // TODO: Firebase auth goes here
      // await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      // TODO: map e.code to friendly messages
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}
          <Text style={styles.logo}>Socialgram</Text>
          <Text style={styles.tagline}>Share your moments with the world</Text>

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          {/* PASSWORD */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#777777"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={10}
            >
              {showPassword ? (
                <EyeOff size={20} color="#999999" />
              ) : (
                <Eye size={20} color="#999999" />
              )}
            </Pressable>
          </View>

          {/* ERROR */}
          {error !== "" && <Text style={styles.error}>{error}</Text>}

          {/* FORGOT PASSWORD */}
          <Pressable style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {/* LOGIN BUTTON */}
          <Pressable
            style={[styles.loginButton, !canSubmit && styles.loginDisabled]}
            onPress={handleLogin}
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginText}>Log in</Text>
            )}
          </Pressable>

          {/* DIVIDER */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* CREATE ACCOUNT */}
          <Pressable style={styles.signupButton}>
            <Text style={styles.signupText}>Create new account</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 30,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.8,
    textAlign: "center",
  },
  tagline: {
    color: "#888888",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    color: "#FFFFFF",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  passwordWrapper: {
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 12,
    justifyContent: "center",
  },
  error: {
    color: "#FF5252",
    fontSize: 13,
    marginBottom: 6,
  },
  forgot: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#3897F0",
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#3897F0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  loginDisabled: {
    opacity: 0.5,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
    gap: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2A2A2A",
  },
  dividerText: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
  },
  signupButton: {
    borderWidth: 1,
    borderColor: "#3897F0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  signupText: {
    color: "#3897F0",
    fontSize: 15,
    fontWeight: "700",
  },
});