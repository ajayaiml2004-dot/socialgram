import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={22} color="grey" />

        <TextInput
          placeholder="Search"
          placeholderTextColor="#888888"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2f2e2e",
    marginTop:20,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
  },
});