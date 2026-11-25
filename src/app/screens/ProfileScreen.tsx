import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bookmark, ChevronDown, Grid3x3, Menu, Plus } from "lucide-react-native";

// -------------------- MOCK DATA --------------------

const user = {
  username: "aj.blaze",
  name: "AK",
  bio: "React Native developer 📱\nBuilding Socialgram ✨",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  followers: 1000,
  following: 300,
};

const highlights = [
  { id: "new", name: "New", image: null },
  {
    id: "1",
    name: "Travel",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200",
  },
  {
    id: "2",
    name: "Food",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200",
  },
  {
    id: "3",
    name: "Friends",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
  },
];

const userPosts = [
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
].map((image, index) => ({ id: String(index), image }));

// -------------------- HELPERS --------------------

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n);

// -------------------- SCREEN --------------------

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const GAP = 2;
  const tileSize = (width - GAP * 2) / 3;

  const data = activeTab === "posts" ? userPosts : [];

  const Header = (
    <View>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Pressable style={styles.usernameRow}>
          <Text style={styles.username}>{user.username}</Text>
          <ChevronDown size={20} color="#FFFFFF" />
        </Pressable>

        <Pressable hitSlop={10}>
          <Menu size={26} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* AVATAR + STATS */}
      <View style={styles.profileRow}>
        <View style={styles.avatarRing}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statsNumber}>{userPosts.length}</Text>
            <Text style={styles.statsLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statsNumber}>{formatCount(user.followers)}</Text>
            <Text style={styles.statsLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statsNumber}>{formatCount(user.following)}</Text>
            <Text style={styles.statsLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* NAME + BIO */}
      <View style={styles.bioSection}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionText}>Edit profile</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionText}>Share profile</Text>
        </Pressable>
      </View>

      {/* HIGHLIGHTS */}
      <FlatList
        data={highlights}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.highlights}
        renderItem={({ item }) => (
          <Pressable style={styles.highlightItem}>
            <View style={styles.highlightCircle}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.highlightImage}
                />
              ) : (
                <Plus size={28} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.highlightName}>{item.name}</Text>
          </Pressable>
        )}
      />

      {/* TABS */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Grid3x3
            size={24}
            color={activeTab === "posts" ? "#FFFFFF" : "#777777"}
          />
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          onPress={() => setActiveTab("saved")}
        >
          <Bookmark
            size={24}
            color={activeTab === "saved" ? "#FFFFFF" : "#777777"}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={data}
        key={activeTab}
        numColumns={3}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Header}
        columnWrapperStyle={{ gap: GAP }}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        renderItem={({ item }) => (
          <Pressable>
            <Image
              source={{ uri: item.image }}
              style={{ width: tileSize, height: tileSize }}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No saved posts yet</Text>
            <Text style={styles.emptyText}>
              Posts you save will show up here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// -------------------- STYLES --------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 56,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  username: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 8,
    gap: 20,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#E1306C",
    padding: 3,
  },
  avatar: {
    flex: 1,
    borderRadius: 45,
    backgroundColor: "#222222",
  },
  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statsNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  statsLabel: {
    color: "#A0A0A0",
    fontSize: 13,
    marginTop: 2,
  },

  bioSection: {
    paddingHorizontal: 18,
    marginTop: 14,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  bio: {
    color: "#DDDDDD",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#262626",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  highlights: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 16,
  },
  highlightItem: {
    alignItems: "center",
    width: 66,
  },
  highlightCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "#444444",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#161616",
  },
  highlightImage: {
    width: "100%",
    height: "100%",
  },
  highlightName: {
    color: "#DDDDDD",
    fontSize: 12,
    marginTop: 6,
  },

  tabs: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#202020",
    marginBottom: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFFFFF",
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyText: {
    color: "#888888",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
});