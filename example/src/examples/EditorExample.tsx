import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextPreview } from 'src/components';
import StyleEditor from 'src/components/StyleEditor';

export default function EditorExample() {
  return (
    <View style={styles.outerContainer}>
      <SafeAreaView>
        {/* Text preview */}
        <TextPreview />
        {/* Style editor */}
        <StyleEditor />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'black',
    flex: 1
  }
});
