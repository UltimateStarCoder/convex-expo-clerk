import { AuthView as ClerkAuthView } from '@clerk/expo/native';
import { StyleSheet, View } from 'react-native';

type AuthMode = 'signIn' | 'signUp';

type AuthViewProps = {
  mode: AuthMode;
  onDismiss: () => void;
};

export function AuthView({ mode, onDismiss }: AuthViewProps) {
  return (
    <View style={styles.container}>
      <ClerkAuthView mode={mode} onDismiss={onDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
