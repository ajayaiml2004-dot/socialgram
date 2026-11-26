import { useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X } from "lucide-react-native";

// -------------------- MOCK DATA --------------------

const photo = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}`;

const users = [
  { id: "1", username: "aj.blaze", name: "AK", image: "1534528741775-53994a69daeb" },
  { id: "2", username: "john.doe", name: "John Doe", image: "1500648767791-00dcc994a43e" },
  { id: "3", username: "mike_travels", name: "Mike", image: "1506794778202-cad84cf45f1d" },
  { id: "4", username: "sara.codes", name: "Sara", image: "1531123897727-8f129e1688ce" },
  { id: "5", username: "priya.clicks", name: "Priya", image: "1524504388940-b1c1722653e1" },
];

const imageIds = [
  "1518837695005-2083093ee35b",
  "1502602898657-3e91760cbb34",
  "1500648767791-00dcc994a43e",
  "1506794778202-cad84cf45f1d",
  "1531123897727-8f129e1688ce",
  "1507003211169-0a1dd7228f2d",
  "1524504388940-b1c1722653e1",
  "1534528741775-53994a69daeb",
];

// Repeat the images so the grid can scroll
const explorePosts = Array.from({ length: 24 }, (_, i) => ({
  id: String(i),
  image: photo(imageIds[i % imageIds.length], 500),
}));

// -------------------- SCREEN --------------------

export default function SearchScreen() {
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const GAP = 2;
  const tileSize = (width - GAP * 2) / 3;

  const query = search.trim().toLowerCase();
  const isSearching = isFocused || query.length > 0;

  // Show all users when the box is empty, otherwise filter
  const results = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query) ||
      u.name.toLowerCase().includes(query)
  );

  const cancelSearch = () => {
    setSearch("");
    setIsFocused(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* SEARCH BAR */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={20} color="#888888" />

          <TextInput
            placeholder="Search"
            placeholderTextColor="#888888"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsFocused(true)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.input}
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={10}>
              <X size={18} color="#888888" />
            </Pressable>
          )}
        </View>

        {isSearching && (
          <Pressable onPress={cancelSearch} hitSlop={10}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        )}
      </View>

      {isSearching ? (
        /* USER RESULTS */
        <FlatList
          key="users"
          data={results}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable style={styles.userRow}>
              <Image
                source={{ uri: photo(item.image, 200) }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found</Text>
          }
        />
      ) : (
        /* EXPLORE GRID */
        <FlatList
          key="explore"
          data={explorePosts}
          numColumns={3}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ gap: GAP }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          renderItem={({ item }) => (
            <Pressable>
              <Image
                source={{ uri: item.image }}
                style={[styles.tile, { width: tileSize, height: tileSize }]}
              />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// -------------------- STYLES --------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
  },
  cancel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#222222",
  },
  username: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  name: {
    color: "#888888",
    fontSize: 14,
    marginTop: 2,
  },
  tile: {
    backgroundColor: "#222222",
  },
  emptyText: {
    color: "#888888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
});