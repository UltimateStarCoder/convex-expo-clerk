import { useUser } from '@clerk/expo';
import { useConvexAuth } from 'convex/react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserButton } from '@/components/user-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <ThemedText style={styles.brandMarkText}>C</ThemedText>
            </View>
            <ThemedText type="smallBold">Clerk + Convex</ThemedText>
          </View>

        <UserButton />
        </View>

        {isLoading ? (
          <LoadingState />
        ) : isAuthenticated ? (
          <SignedInContent />
        ) : (
          <LoadingState />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function LoadingState() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#6C47FF" />
      <ThemedText themeColor="textSecondary">Connecting Clerk to Convex…</ThemedText>
    </View>
  );
}

function SignedInContent() {
  const { user } = useUser();
  const displayName =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Authenticated user';

  return (
    <View style={styles.content}>
      <View style={styles.copy}>
        <ThemedText type="code" style={styles.eyebrow}>
          CONVEX AUTHENTICATED
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Welcome, {displayName}.
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.description}>
          Clerk owns the session, and Convex has accepted its access token. Authenticated queries
          can safely render here.
        </ThemedText>
      </View>

      <ThemedView type="backgroundElement" style={styles.card}>
        <StatusRow label="Clerk session" value="Active" accent />
        <View style={styles.divider} />
        <StatusRow label="Convex connection" value="Authenticated" accent />
      </ThemedView>
    </View>
  );
}

function StatusRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.statusRow}>
      <ThemedText themeColor="textSecondary">{label}</ThemedText>
      <View style={styles.statusValue}>
        <View style={[styles.statusDot, accent && styles.statusDotActive]} />
        <ThemedText type="smallBold">{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandMark: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#6C47FF',
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.five,
    paddingVertical: Spacing.four,
  },
  copy: {
    gap: Spacing.three,
  },
  eyebrow: {
    color: '#6C47FF',
    letterSpacing: 1.5,
  },
  title: {
    maxWidth: 650,
  },
  description: {
    maxWidth: 580,
    fontSize: 18,
    lineHeight: 28,
  },
  card: {
    gap: Spacing.three,
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E93',
    opacity: 0.35,
  },
  statusRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8E8E93',
  },
  statusDotActive: {
    backgroundColor: '#22C55E',
  },
});
