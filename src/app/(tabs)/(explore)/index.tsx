import { useClerk } from '@clerk/expo';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { Linking, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ExploreScreen() {
  const { signOut } = useClerk();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
  });

  return (
    <>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInset={insets}
        contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.intro}>
            <ThemedText style={styles.centerText} themeColor="textSecondary">
              This starter app includes example{'\n'}code to help you get started.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.sectionsWrapper}>
            <Collapsible title="File-based routing">
              <ThemedText type="small">
                This app has two stack-backed tab screens:{' '}
                <ThemedText type="code">src/app/(tabs)/(home)/index.tsx</ThemedText> and{' '}
                <ThemedText type="code">src/app/(tabs)/(explore)/index.tsx</ThemedText>.
              </ThemedText>
              <ThemedText type="small">
                Each tab group has its own stack layout, while{' '}
                <ThemedText type="code">src/app/(tabs)/_layout.tsx</ThemedText> sets up the native
                tabs.
              </ThemedText>
              <ExternalLink href="https://docs.expo.dev/router/introduction">
                <ThemedText type="linkPrimary">Learn more</ThemedText>
              </ExternalLink>
            </Collapsible>

            <Collapsible title="Native platform support">
              <ThemedText type="small">
                This app targets Android and iOS with platform-native tabs and Clerk authentication
                components.
              </ThemedText>
            </Collapsible>

            <Collapsible title="Images">
              <ThemedText type="small">
                For static images, you can use the <ThemedText type="code">@2x</ThemedText> and{' '}
                <ThemedText type="code">@3x</ThemedText> suffixes to provide files for different
                screen densities.
              </ThemedText>
              <Image source={require('@/assets/images/react-logo.png')} style={styles.imageReact} />
              <ExternalLink href="https://reactnative.dev/docs/images">
                <ThemedText type="linkPrimary">Learn more</ThemedText>
              </ExternalLink>
            </Collapsible>

            <Collapsible title="Light and dark mode components">
              <ThemedText type="small">
                This template has light and dark mode support. The{' '}
                <ThemedText type="code">useColorScheme()</ThemedText> hook lets you inspect what the
                user&apos;s current color scheme is, so you can adjust UI colors accordingly.
              </ThemedText>
              <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
                <ThemedText type="linkPrimary">Learn more</ThemedText>
              </ExternalLink>
            </Collapsible>

            <Collapsible title="Animations">
              <ThemedText type="small">
                This template includes an example of an animated component. The{' '}
                <ThemedText type="code">src/components/ui/collapsible.tsx</ThemedText> component
                uses the powerful <ThemedText type="code">react-native-reanimated</ThemedText>{' '}
                library to animate opening this hint.
              </ThemedText>
            </Collapsible>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <Stack.Title>Explore</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button onPress={() => void Linking.openURL('https://docs.expo.dev')}>
          Docs
        </Stack.Toolbar.Button>
        <Stack.Toolbar.Menu icon="person.crop.circle">
          <Stack.Toolbar.MenuAction
            icon="person.crop.circle"
            onPress={() => router.push('/profile')}>
            Manage account
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction
            destructive
            icon="rectangle.portrait.and.arrow.right"
            onPress={() => void signOut()}>
            Sign out
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  intro: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});
