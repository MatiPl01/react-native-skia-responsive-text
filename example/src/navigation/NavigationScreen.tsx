import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppStackScreen, useAppStackNavigation } from 'src/types';

export default function NavigationScreen() {
  const navigation = useAppStackNavigation();

  return (
    <View>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(AppStackScreen.Editor)}>
        <Text style={styles.heading}>Text Editor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(AppStackScreen.Usage)}>
        <Text style={styles.heading}>Usage Example</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(AppStackScreen.Readme)}>
        <Text style={styles.heading}>Readme Example</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: 'rgba(0, 0, 0, .25)',
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  heading: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
