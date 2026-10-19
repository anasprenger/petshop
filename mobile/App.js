import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './src/components/Toast';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.rose,
    background: colors.canvas,
    card: colors.surface,
    text: colors.ink,
    border: colors.line,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </ToastProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
