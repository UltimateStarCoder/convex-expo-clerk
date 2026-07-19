import { useMutation, useQuery } from 'convex/react';
import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { api } from '@/../convex/_generated/api';
import type { Doc } from '@/../convex/_generated/dataModel';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { toolbarIcons } from '@/constants/toolbar-icons';
import { useTheme } from '@/hooks/use-theme';

type Item = Omit<Doc<'items'>, 'ownerTokenIdentifier'>;

export default function ItemsScreen() {
  const items = useQuery(api.items.list);
  const removeItem = useMutation(api.items.remove);
  const router = useRouter();
  const theme = useTheme();

  function openCreateItem() {
    router.push('/(tabs)/(items)/item-form');
  }

  function confirmDelete(item: Item) {
    Alert.alert('Delete item?', `“${item.title}” will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void removeItem({ id: item._id }).catch((error: unknown) => {
            Alert.alert('Could not delete item', getErrorMessage(error));
          });
        },
      },
    ]);
  }

  return (
    <>
      <ThemedView style={styles.screen}>
        {items === undefined ? (
          <View style={styles.centered}>
            <ActivityIndicator color={theme.primary} size="large" />
            <ThemedText themeColor="textSecondary">Loading items…</ThemedText>
          </View>
        ) : (
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[
              styles.listContent,
              items.length === 0 && styles.emptyListContent,
            ]}
            data={items}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<EmptyState onCreate={openCreateItem} />}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onDelete={() => confirmDelete(item)}
                onEdit={() =>
                  router.push({
                    pathname: '/(tabs)/(items)/item-form',
                    params: { id: item._id },
                  })
                }
              />
            )}
          />
        )}
      </ThemedView>

      <Stack.Title>Items</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          accessibilityLabel="Create item"
          icon={toolbarIcons.add}
          onPress={openCreateItem}
        />
      </Stack.Toolbar>
    </>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View style={styles.emptyState}>
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        No items yet
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.emptyDescription}>
        Create your first item. It will be stored securely in Convex and visible only to your
        account.
      </ThemedText>
      <Pressable accessibilityRole="button" onPress={onCreate} style={styles.primaryButton}>
        <ThemedText themeColor="onPrimary" style={styles.buttonLabel}>
          Create item
        </ThemedText>
      </Pressable>
    </View>
  );
}

function ItemCard({
  item,
  onDelete,
  onEdit,
}: {
  item: Item;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.cardCopy}>
        <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
        {item.description ? (
          <ThemedText themeColor="textSecondary" numberOfLines={3}>
            {item.description}
          </ThemedText>
        ) : null}
        <ThemedText type="small" themeColor="textSecondary">
          Updated {new Date(item.updatedAt).toLocaleString()}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onEdit}>
          <ThemedText themeColor="primary" style={styles.actionLabel}>
            Edit
          </ThemedText>
        </Pressable>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={onDelete}>
          <ThemedText style={[styles.actionLabel, styles.deleteLabel]}>Delete</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again.';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    maxWidth: 420,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 48,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: '#6C47FF',
    paddingHorizontal: Spacing.four,
  },
  buttonLabel: {
    fontWeight: '700',
  },
  card: {
    gap: Spacing.three,
    borderRadius: Spacing.three,
    borderCurve: 'continuous',
    padding: Spacing.three,
  },
  cardCopy: {
    gap: Spacing.two,
  },
  itemTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  actionLabel: {
    fontWeight: '700',
  },
  deleteLabel: {
    color: '#DC2626',
  },
});
