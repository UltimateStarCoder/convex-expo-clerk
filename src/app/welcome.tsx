import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          alwaysBounceVertical={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcome}>
            <View
              style={[styles.brandMark, { backgroundColor: theme.primary }]}>
              <ThemedText
                themeColor="onPrimary"
                style={styles.brandMarkText}>
                C
              </ThemedText>
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
              <Button
                label="Sign in"
                onPress={() => router.push('/sign-in')}
              />
              <Button
                label="Create account"
                onPress={() => router.push('/sign-up')}
                variant="secondary"
              />
            </View>
          </View>
        </ScrollView>
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
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.four,
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
    borderCurve: 'continuous',
  },
  brandMarkText: {
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
});
