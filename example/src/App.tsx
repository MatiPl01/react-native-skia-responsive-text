import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStackNavigator } from './navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style='dark' />
        <AppStackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
