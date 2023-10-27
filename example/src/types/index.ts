import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AnimationType = 'none' | 'progress' | 'timing';

export enum AppStackScreen {
  Editor = 'Editor',
  Home = 'Home',
  Readme = 'Readme',
  Usage = 'Usage'
}

type AppStackParamList = Record<AppStackScreen, undefined>;

type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function useAppStackNavigation() {
  return useNavigation<AppStackNavigationProp>();
}
