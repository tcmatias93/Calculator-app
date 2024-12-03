import { Platform, View } from "react-native";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import { globalStyles } from "@/styles/global-styles";

const isAndroid = Platform.OS === "android";

if (isAndroid) {
  NavigationBar.setBackgroundColorAsync("black");
}

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={globalStyles.background}>
      {/* Renderizo rutas hijas */}
      <Slot />
      <StatusBar style="light" />
    </View>
  );
};

export default RootLayout;
