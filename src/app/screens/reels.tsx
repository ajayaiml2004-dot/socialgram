import { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import { useVideoPlayer, VideoView } from "expo-video";

import {
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Send,
} from "lucide-react-native";

import {
  GestureDetector,
  useExclusiveGestures,
  useTapGesture,
} from "react-native-gesture-handler";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function ReelsScreen() {
  // STATES
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paused, setPaused] = useState(false);

  // VIDEO PLAYER
  const player = useVideoPlayer(VIDEO_URL, (player) => {
    player.loop = true;
    player.play();
  });

  // PLAY / PAUSE FUNCTION
  const togglePlayback = () => {
    if (paused) {
      player.play();
    } else {
      player.pause();
    }

    setPaused(!paused);
  };

  // HEART ANIMATION VALUES
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  // ANIMATED STYLE
  const animation = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  // DOUBLE TAP ANIMATION
  const handleDoubleTap = () => {
    setLiked(true);

    heartScale.value = 0;
    heartOpacity.value = 0;

    heartOpacity.value = withTiming(1, {
      duration: 150,
    });

    heartScale.value = withSpring(1.3, {}, (finished) => {
      if (finished) {
        heartScale.value = withTiming(0, {
          duration: 400,
        });

        heartOpacity.value = withTiming(0, {
          duration: 400,
        });
      }
    });
  };

  // SINGLE TAP GESTURE
  const singleTap = useTapGesture({
    numberOfTaps: 1,
    runOnJS: true,

    onDeactivate: (event) => {
      if (!event.canceled) {
        togglePlayback();
      }
    },
  });

  // DOUBLE TAP GESTURE
  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    runOnJS: true,

    onDeactivate: (event) => {
      if (!event.canceled) {
        handleDoubleTap();
      }
    },
  });

  // COMBINE GESTURES
  const tapGesture = useExclusiveGestures(doubleTap, singleTap);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* VIDEO */}
      <GestureDetector gesture={tapGesture}>
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"
            nativeControls={false}
          />

          {/* ANIMATED HEART */}
          <Animated.View
            pointerEvents="none"
            style={[styles.heartAnimation, animation]}
          >
            <Heart size={90} color="#FFFFFF" fill="#FF3B65" />
          </Animated.View>

          {/* PLAY ICON */}
          {paused && (
            <View style={styles.playIcon}>
              <Play size={55} color="white" fill="white" />
            </View>
          )}
        </View>
      </GestureDetector>

      {/* TOP HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reels</Text>
      </View>

      {/* RIGHT ACTIONS */}
      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => setLiked(!liked)}>
          <Heart
            size={30}
            color={liked ? "#ff3040" : "white"}
            fill={liked ? "#ff3040" : "transparent"}
          />

          <Text style={styles.actionText}>{liked ? "1.2K" : "1.1K"}</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <MessageCircle size={30} color="white" />
          <Text style={styles.actionText}>245</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Send size={29} color="white" />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => setSaved(!saved)}>
          <Bookmark
            size={29}
            color="white"
            fill={saved ? "white" : "transparent"}
          />

          <Text style={styles.actionText}>{saved ? "Saved" : "Save"}</Text>
        </Pressable>
      </View>

      {/* BOTTOM DETAILS */}
      <View style={styles.bottomInfo}>
        <Text style={styles.username}>@travel_diaries</Text>

        <Text style={styles.caption}>Exploring the beautiful world 🌍✨</Text>

        <Text style={styles.audio}>♫ Original audio</Text>
      </View>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  videoContainer: {
    ...StyleSheet.absoluteFill,
  },

  video: {
    width: "100%",
    height: "100%",
  },

  header: {
    position: "absolute",
    top: 55,
    left: 20,
  },

  headerTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  actions: {
    position: "absolute",
    right: 15,
    bottom: 115,
    alignItems: "center",
    gap: 25,
  },

  actionButton: {
    alignItems: "center",
  },

  actionText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },

  bottomInfo: {
    position: "absolute",
    bottom: 40,
    left: 15,
    gap: 8,
  },

  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  caption: {
    color: "white",
    fontSize: 14,
  },

  audio: {
    color: "white",
    fontSize: 12,
  },

  playIcon: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
  },

  heartAnimation: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    zIndex: 10,
  },
});
