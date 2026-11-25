import { router, usePathname } from "expo-router";
import { Clapperboard, House, Plus, Search, User } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

const tabs = [
  { name: "Home", icon: House, route: "/" },
  { name: "Search", icon: Search, route: "/screens/SearchScreen" },
  { name: "Create", icon: Plus, route: null },
  { name: "Reels", icon: Clapperboard, route: "/screens/reels" },
  { name: "Profile", icon: User, route: "/screens/ProfileScreen" },
] as const;

// Screens where the bottom bar must be hidden
const hiddenRoutes = ["/login"];

export default function BottomNavigation() {
  const pathname = usePathname();

  // Don't show the bottom bar on the login page
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.route !== null && pathname === tab.route;

        return (
          <Pressable
            key={tab.name}
            style={styles.navItem}
            onPress={() => {
              if (tab.route) {
                router.push(tab.route);
              }
            }}
          >
            <Icon color={isActive ? "#ffffff" : "#A0A0A0"} size={25} />

            <View style={[styles.navDot, isActive && styles.activeNavDot]} />
          </Pressable>
        );
      })}

      
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#080808",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  activeNavDot: {
    backgroundColor: "#FF3040",
  },
});