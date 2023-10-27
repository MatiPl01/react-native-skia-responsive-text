import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackScreen } from 'src/types';

import { EditorExample, ReadmeExample, UsageExample } from '../examples';
import NavigationScreen from './NavigationScreen';

const AppStack = createNativeStackNavigator();

export default function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        animation: 'slide_from_right'
      }}>
      <AppStack.Screen
        component={NavigationScreen}
        name={AppStackScreen.Home}
      />
      <AppStack.Screen component={EditorExample} name={AppStackScreen.Editor} />
      <AppStack.Screen component={ReadmeExample} name={AppStackScreen.Readme} />
      <AppStack.Screen component={UsageExample} name={AppStackScreen.Usage} />
    </AppStack.Navigator>
  );
}
