import { AuthView } from '@clerk/expo/native';
import { StyleSheet, View } from 'react-native';

export function AuthScreen() {
  return (
    <View style={styles.container}>
      <AuthView mode="signInOrUp" isDismissible={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
