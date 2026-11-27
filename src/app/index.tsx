import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  GestureDetector,
  useCompetingGestures,
  useLongPressGesture,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";

import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import {
  Bookmark,
  Clapperboard,
  Flag,
  Heart,
  House,
  Link,
  MessageCircle,
  Plus,
  Search,
  Send,
  User,
  UserRound,
  X,
} from "lucide-react-native";

// -------------------- DATA --------------------

const stories = [
  {
    id: "1",
    name: "Your story",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    own: true,
  },
  {
    id: "2",
    name: "sarah",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
  },
  {
    id: "3",
    name: "alex",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  },
  {
    id: "4",
    name: "mike",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
  },
  {
    id: "5",
    name: "emma",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150",
  },
  {
    id: "6",
    name: "david",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
];

const posts = [
  {
    id: "1",
    username: "alex_morgan",
    location: "Bali, Indonesia",
    profile:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900",
    caption: "Somewhere between the sky and the ocean. 🌊",
    likes: 2486,
  },
  {
    id: "2",
    username: "sarah_j",
    location: "Paris, France",
    profile:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
    caption: "Paris has my heart. ✨",
    likes: 1832,
  },
];

const tabs = [
  { name: "Home", icon: House },
  { name: "Search", icon: Search },
  { name: "Create", icon: Plus },
  { name: "Reels", icon: Clapperboard },
  { name: "Profile", icon: User },
];

// -------------------- POST COMPONENT --------------------

type PostCardProps = {
  post: (typeof posts)[number];
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
};

function PostCard({
  post,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
}: PostCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const zoom = useSharedValue(1);
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);

  // Large heart animation

  const bigHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      {
        rotate: `${interpolate(translateX.value, [-width, 0, width], [-6, 0, 6])}deg`,
      },
      { scale: zoom.value },
    ],
    zIndex: zoom.value > 1 ? 10 : 0,
  }));

  // Like button animation

  const likeButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Double-tap animation and like functionality

  const handleDoubleTap = () => {
    // Double tap should like, not unlike an already-liked post
    if (!isLiked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onToggleLike(post.id);
    }

    cancelAnimation(heartScale);
    cancelAnimation(heartOpacity);

    heartScale.value = 0;
    heartOpacity.value = 1;

    heartScale.value = withSpring(1.3, {}, (finished) => {
      if (finished) {
        heartScale.value = withTiming(0, {
          duration: 300,
        });
      }
    });

    heartOpacity.value = withTiming(0, {
      duration: 800,
    });
  };

  // -------------------- LONG PRESS GESTURE --------------------

  const longPress = useLongPressGesture({
    minDuration: 600,
    runOnJS: true,

    onActivate: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setMenuVisible(true);
    },
  });

  // -------------------- DOUBLE TAP GESTURE --------------------

  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    runOnJS: true,

    onDeactivate: (event) => {
      if (!event.canceled) {
        handleDoubleTap();
      }
    },
  });

  // -------------------- COMBINE BOTH GESTURES --------------------

  const pinch = usePinchGesture({
    onUpdate: (event) => {
      zoom.value = Math.max(1, event.scale); // never smaller than normal
    },
    onDeactivate: () => {
      zoom.value = withSpring(1); // spring back when fingers lift
    },
  });

  const pan = usePanGesture({
    activeOffsetX: [-15, 15], // only activate after sideways movement
    failOffsetY: [-10, 10], // vertical movement lets the feed scroll

    onUpdate: (event) => {
      if (zoom.value > 1) return; // don't swipe while pinch-zooming
      translateX.value = event.translationX;
    },

    onDeactivate: () => {
      translateX.value = withSpring(0); // just snap back
    },
  });

  const tapGestures = useCompetingGestures(longPress, doubleTap);

  // pinch works at the same time as tap/long-press
  const postGestures = useSimultaneousGestures(pinch, pan, tapGestures);

  // Like button animation

  const handleLikePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleLike(post.id);

    cancelAnimation(buttonScale);

    buttonScale.value = 1;

    buttonScale.value = withSpring(1.35, {}, (finished) => {
      if (finished) {
        buttonScale.value = withSpring(1);
      }
    });
  };

  const handleSavePress = () => {
    Haptics.selectionAsync(); // light "tick"
    onToggleSave(post.id);
  };

  return (
    <View style={styles.post}>
      {/* POST HEADER */}

      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.profile }} style={styles.profileImage} />

          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.location}>{post.location}</Text>
          </View>
        </View>

        <Pressable>
          <Text style={styles.moreIcon}>•••</Text>
        </Pressable>
      </View>

      {/* POST OPTIONS MODAL */}

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.popupMenu}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Post options</Text>

              <Pressable onPress={() => setMenuVisible(false)}>
                <X size={22} color="#FFFFFF" />
              </Pressable>
            </View>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                handleSavePress();
                setMenuVisible(false);
              }}
            >
              <Bookmark
                size={21}
                color="#FFFFFF"
                fill={isSaved ? "#FFFFFF" : "transparent"}
              />

              <Text style={styles.menuText}>
                {isSaved ? "Remove from saved" : "Save post"}
              </Text>
            </Pressable>

            <Pressable style={styles.menuItem}>
              <Link size={21} color="#FFFFFF" />
              <Text style={styles.menuText}>Copy link</Text>
            </Pressable>

            <Pressable style={styles.menuItem}>
              <UserRound size={21} color="#FFFFFF" />
              <Text style={styles.menuText}>View profile</Text>
            </Pressable>

            <Pressable style={styles.menuItem}>
              <Flag size={21} color="#FF5252" />

              <Text style={[styles.menuText, { color: "#FF5252" }]}>
                Report post
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* POST IMAGE + DOUBLE TAP + LONG PRESS */}

      <GestureDetector gesture={postGestures}>
        <Animated.View style={zoomStyle}>
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            resizeMode="cover"
          />

          <Animated.View
            pointerEvents="none"
            style={[styles.bigHeart, bigHeartStyle]}
          >
            <Heart size={100} color="#FFFFFF" fill="#FF3B65" />
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* POST ACTIONS */}

      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          {/* LIKE */}

          <Pressable onPress={handleLikePress}>
            <Animated.View style={likeButtonStyle}>
              <Heart
                size={26}
                color={isLiked ? "#FF3B65" : "#FFFFFF"}
                fill={isLiked ? "#FF3B65" : "transparent"}
              />
            </Animated.View>
          </Pressable>

          {/* COMMENT */}

          <Pressable>
            <MessageCircle size={26} color="#FFFFFF" />
          </Pressable>

          {/* SHARE */}

          <Pressable>
            <Send size={25} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* BOOKMARK */}

        <Pressable onPress={handleSavePress}>
          <Bookmark
            size={25}
            color="#FFFFFF"
            fill={isSaved ? "#FFFFFF" : "transparent"}
          />
        </Pressable>
      </View>

      {/* POST DETAILS */}

      <View style={styles.postDetails}>
        <Text style={styles.likes}>
          {(post.likes + (isLiked ? 1 : 0)).toLocaleString()} likes
        </Text>

        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{post.username} </Text>
          {post.caption}
        </Text>

        <Pressable>
          <Text style={styles.comments}>View all comments</Text>
        </Pressable>

        <Text style={styles.time}>2 HOURS AGO</Text>
      </View>
    </View>
  );
}

// -------------------- MAIN SCREEN --------------------

export default function HomeScreen() {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleLike = (id: string) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSave = (id: string) => {
    setSavedPosts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.logo}>Socialgram.</Text>

        <View style={styles.headerActions}>
          <Pressable>
            <Heart size={25} color="#FFFFFF" />
          </Pressable>

          <Pressable>
            <Send size={25} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#E1306C"]}
            progressBackgroundColor="#202020"
          />
        }
      >
        {/* STORIES */}

        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>Stories</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
          >
            {stories.map((story) => (
              <Pressable key={story.id} style={styles.storyItem}>
                <View
                  style={[
                    styles.storyBorder,
                    story.own && styles.ownStoryBorder,
                  ]}
                >
                  <Image
                    source={{ uri: story.image }}
                    style={styles.storyImage}
                  />
                </View>

                {story.own && (
                  <View style={styles.addStory}>
                    <Text style={styles.addStoryText}>+</Text>
                  </View>
                )}

                <Text style={styles.storyName}>{story.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.separator} />

        {/* FEED */}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isLiked={likedPosts.includes(post.id)}
            isSaved={savedPosts.includes(post.id)}
            onToggleLike={toggleLike}
            onToggleSave={toggleSave}
          />
        ))}
      </ScrollView>

      {/* LOGOUT BUTTON */}

      <Pressable
        style={styles.showModalButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>

      {/* LOGOUT MODAL */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout?</Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  // TODO: await signOut(auth) goes here once Firebase is connected
                  router.replace("/screens/LoginScreen");
                }}
                style={styles.logoutButton}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -1.2,
  },

  headerActions: {
    flexDirection: "row",
    gap: 22,
  },

  storiesSection: {
    paddingTop: 15,
    paddingBottom: 18,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 15,
  },

  storiesList: {
    paddingHorizontal: 15,
    gap: 17,
  },

  storyItem: {
    alignItems: "center",
    width: 67,
  },

  storyBorder: {
    width: 65,
    height: 65,
    borderRadius: 33,
    padding: 3,
    borderWidth: 2,
    borderColor: "#E1306C",
  },

  ownStoryBorder: {
    borderColor: "#555555",
  },

  storyImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },

  addStory: {
    position: "absolute",
    right: 0,
    bottom: 22,
    backgroundColor: "#3897F0",
    width: 21,
    height: 21,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#080808",
  },

  addStoryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 18,
  },

  storyName: {
    color: "#BBBBBB",
    fontSize: 11,
    marginTop: 7,
  },

  separator: {
    height: 1,
    backgroundColor: "#202020",
  },

  post: {
    marginBottom: 25,
    zIndex: 1,
  },

  postHeader: {
    height: 65,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profileImage: {
    width: 39,
    height: 39,
    borderRadius: 20,
  },

  username: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  location: {
    color: "#999999",
    fontSize: 11,
    marginTop: 3,
  },

  moreIcon: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  postImage: {
    width: "100%",
    height: 390,
    backgroundColor: "#222222",
  },

  bigHeart: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingTop: 13,
    paddingBottom: 8,
  },

  leftActions: {
    flexDirection: "row",
    gap: 20,
  },

  postDetails: {
    paddingHorizontal: 17,
  },

  likes: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },

  caption: {
    color: "#DDDDDD",
    fontSize: 13,
    lineHeight: 20,
  },

  captionUsername: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  comments: {
    color: "#777777",
    fontSize: 12,
    marginTop: 7,
  },

  time: {
    color: "#555555",
    fontSize: 9,
    marginTop: 9,
    letterSpacing: 1,
  },

  showModalButton: {
    backgroundColor: "#E63946",
    padding: 12,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
  },

  modalMessage: {
    fontSize: 15,
    color: "#666666",
    marginVertical: 15,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: "#777777",
    padding: 12,
    borderRadius: 8,
  },

  logoutButton: {
    backgroundColor: "#E63946",
    padding: 12,
    borderRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupMenu: {
    width: "82%",
    backgroundColor: "#202020",
    borderRadius: 18,
    padding: 18,
  },

  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  menuTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 15,
  },

  menuText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
});
