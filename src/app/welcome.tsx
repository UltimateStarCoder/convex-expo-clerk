import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WelcomeScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.welcome}>
          <View style={styles.brandMark}>
            <ThemedText style={styles.brandMarkText}>C</ThemedText>
          </View>

          <View style={styles.copy}>
            <ThemedText type="subtitle" style={styles.centeredText}>
              Welcome
            </ThemedText>
            <ThemedText
              themeColor="textSecondary"
              style={styles.centeredText}>
              Sign in to continue, or create an account to get started.
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <Link href="/sign-in" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={styles.primaryButtonText}>
                  Sign in
                </ThemedText>
              </Pressable>
            </Link>

            <Link href="/sign-up" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.secondaryButton,
                  { borderColor: theme.backgroundSelected },
                  pressed && styles.pressed,
                ]}>
                <ThemedText type="smallBold">Create account</ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  welcome: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    alignItems: 'center',
    gap: Spacing.five,
  },
  brandMark: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#6C47FF',
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  copy: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  centeredText: {
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: Spacing.three,
  },
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  primaryButton: {
    backgroundColor: '#6C47FF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.72,
  },
});
