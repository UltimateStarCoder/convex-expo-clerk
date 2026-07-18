import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type ButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary';
};

export function Button({
  label,
  onPress,
  variant = 'primary',
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={{
        color: isPrimary ? '#FFFFFF24' : theme.backgroundSelected,
      }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary
            ? theme.primary
            : theme.backgroundElement,
          borderColor: isPrimary
            ? theme.primary
            : theme.backgroundSelected,
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText
        themeColor={isPrimary ? 'onPrimary' : 'text'}
        style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
