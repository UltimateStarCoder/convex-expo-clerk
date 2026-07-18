import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthScreen } from '@/components/auth-screen';
import { ThemedView } from '@/components/themed-view';

export default function SignUpScreen() {
  const router = useRouter();

  function returnToWelcome() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/welcome');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <AuthScreen mode="signUp" onDismiss={returnToWelcome} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
});
