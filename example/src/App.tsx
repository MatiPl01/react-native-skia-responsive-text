import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { EditorExample } from './examples';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      <EditorExample />
    </SafeAreaProvider>
  );
}
