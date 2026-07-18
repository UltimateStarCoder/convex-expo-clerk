import { AuthView } from '@clerk/expo/native';
import { StyleSheet, View } from 'react-native';

type AuthMode = 'signIn' | 'signUp';

type AuthScreenProps = {
  mode: AuthMode;
  onDismiss: () => void;
};

export function AuthScreen({ mode, onDismiss }: AuthScreenProps) {
  return (
    <View style={styles.container}>
      <AuthView mode={mode} onDismiss={onDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
