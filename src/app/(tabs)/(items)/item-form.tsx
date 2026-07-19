import { useMutation, useQuery } from 'convex/react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ItemFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const itemId = id as Id<'items'> | undefined;
  const item = useQuery(api.items.get, itemId ? { id: itemId } : 'skip');
  const router = useRouter();
  const theme = useTheme();
  const isEditing = itemId !== undefined;

  useEffect(() => {
    if (isEditing && item === null) {
      Alert.alert('Item not found', 'This item may have been deleted.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  }, [isEditing, item, router]);

  const isLoading = isEditing && item === undefined;

  return (
    <>
      {isLoading ? (
        <View style={[styles.loading, { backgroundColor: theme.background }]}>
          <ActivityIndicator color={theme.primary} size="large" />
        </View>
      ) : item === null ? (
        <View style={[styles.loading, { backgroundColor: theme.background }]} />
      ) : (
        <ItemEditor
          initialDescription={item?.description ?? ''}
          initialTitle={item?.title ?? ''}
          itemId={itemId}
        />
      )}

      <Stack.Title>{isEditing ? 'Edit item' : 'New item'}</Stack.Title>
    </>
  );
}

function ItemEditor({
  initialDescription,
  initialTitle,
  itemId,
}: {
  initialDescription: string;
  initialTitle: string;
  itemId?: Id<'items'>;
}) {
  const createItem = useMutation(api.items.create);
  const updateItem = useMutation(api.items.update);
  const router = useRouter();
  const theme = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      Alert.alert('Title required', 'Enter a title before saving.');
      return;
    }

    setIsSaving(true);

    try {
      if (itemId) {
        await updateItem({
          id: itemId,
          title: normalizedTitle,
          description,
        });
      } else {
        await createItem({
          title: normalizedTitle,
          description,
        });
      }

      router.back();
    } catch (error) {
      Alert.alert('Could not save item', getErrorMessage(error));
      setIsSaving(false);
    }
  }

  return (
    <>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <TextInput
            accessibilityLabel="Item title"
            autoCapitalize="sentences"
            autoCorrect
            editable={!isSaving}
            maxLength={120}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="next"
            style={[
              styles.titleInput,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
              },
            ]}
            value={title}
          />
          <TextInput
            accessibilityLabel="Item description"
            autoCapitalize="sentences"
            autoCorrect
            editable={!isSaving}
            maxLength={2_000}
            multiline
            onChangeText={setDescription}
            placeholder="Description (optional)"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.descriptionInput,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
              },
            ]}
            textAlignVertical="top"
            value={description}
          />
          <View style={styles.buttons}>
            <Button
              disabled={isSaving}
              label={isSaving ? 'Saving…' : itemId ? 'Save changes' : 'Create item'}
              onPress={() => void save()}
            />
            <Button
              disabled={isSaving}
              label="Cancel"
              onPress={() => router.back()}
              variant="secondary"
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again.';
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
  },
  form: {
    gap: Spacing.three,
  },
  titleInput: {
    minHeight: 54,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    fontWeight: '600',
  },
  descriptionInput: {
    minHeight: 180,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    lineHeight: 24,
  },
  buttons: {
    gap: Spacing.three,
  },
});
