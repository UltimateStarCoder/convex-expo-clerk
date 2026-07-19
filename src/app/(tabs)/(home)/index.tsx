import { useClerk, useUser } from '@clerk/expo';
import AccountCircleIcon from '@expo/material-symbols/account_circle.xml';
import AddIcon from '@expo/material-symbols/add.xml';
import LogoutIcon from '@expo/material-symbols/logout.xml';
import ManageAccountsIcon from '@expo/material-symbols/manage_accounts.xml';
import { useConvexAuth } from 'convex/react';
import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <>
      <ThemedView style={styles.container}>
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
          {isLoading ? (
            <LoadingState />
          ) : isAuthenticated ? (
            <SignedInContent />
          ) : (
            <LoadingState />
          )}
        </SafeAreaView>
      </ThemedView>

      <Stack.Title>Home</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          accessibilityLabel="Add"
          icon={process.env.EXPO_OS === 'ios' ? 'plus' : AddIcon}
          onPress={() => Alert.alert('Add', 'Add action selected.')}
        />
        <Stack.Toolbar.Menu
          accessibilityLabel="Account"
          icon={process.env.EXPO_OS === 'ios' ? 'person.crop.circle' : AccountCircleIcon}>
          <Stack.Toolbar.MenuAction
            icon={process.env.EXPO_OS === 'ios' ? 'person.crop.circle' : ManageAccountsIcon}
            onPress={() => router.push('/profile')}>
            Manage account
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction
            destructive
            icon={
              process.env.EXPO_OS === 'ios' ? 'rectangle.portrait.and.arrow.right' : LogoutIcon
            }
            onPress={() => void signOut()}>
            Sign out
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
    </>
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
