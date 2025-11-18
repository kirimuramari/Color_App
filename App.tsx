import { useEffect } from "react";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorSelectorScreen from "./src/screens/ColorSelectorScreen";
import * as SystemUI from "expo-system-ui";
import React from "react";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#A3E4DB",
    secondary: "#FFB6C1",
    background: "#FFF8F8",
    surface: "#FFFFFF",
    onSurface: "#333333",
  },
  roundness: 20,
};

export default function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("white");
  }, []);
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ColorSelectorScreen />
      </SafeAreaView>
    </PaperProvider>
  );
}
