import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import RecipeFinder from './src/pages/RecipeFinder';

export default function App() {
  return (
    <View style={styles.container}>
      <AppNavigator></AppNavigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
