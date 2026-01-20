import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens'
import MainRoute from './src/Stacks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableScreens()

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <MainRoute />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
