import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ScreenData } from "../../types/flow";
import { frameworkMap } from "../frameworkMap";

export async function exportCodeToZip(screens: ScreenData[]) {
  const zip = new JSZip();

  // Screens
  screens.forEach((screen) => {
    const codeLines = screen.components.map((comp) =>
      frameworkMap["react-native"][comp.type].code(comp)
    );

    const fileContent = `
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function ${screen.screen.replace(/\s+/g, "")}() {
  return (
    <View style={styles.container}>
      ${codeLines.join("\n      ")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 12,
  },
});
`;

    zip.file(`screens/${screen.screen.replace(/\s+/g, "")}.tsx`, fileContent.trim());
  });

  // Navigator
  const importScreens = screens
    .map((s) => `import ${s.screen.replace(/\s+/g, "")} from './screens/${s.screen.replace(/\s+/g, "")}';`)
    .join("\n");

  const routes = screens
    .map((s) => `<Stack.Screen name="${s.screen}" component={${s.screen.replace(/\s+/g, "")}} />`)
    .join("\n      ");

  const navigatorCode = `
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
${importScreens}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="${screens[0].screen}">
        ${routes}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
`;

  zip.file("App.tsx", navigatorCode.trim());

  // Package.json
  zip.file("package.json", JSON.stringify({
    name: "wireflow-app",
    version: "1.0.0",
    dependencies: {
      "react": "18.2.0",
      "react-native": "0.73.0",
      "@react-navigation/native": "^6.1.7",
      "@react-navigation/native-stack": "^6.9.12"
    }
  }, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "wireflow-export.zip");
}