import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { CurrentUserSync } from '@/components/current-user-sync';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <>
      <CurrentUserSync />
      <NativeTabs
        backgroundColor={colors.background}
        indicatorColor={colors.backgroundElement}
        labelStyle={{ selected: { color: colors.text } }}>
        <NativeTabs.Trigger name="(home)">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'house', selected: 'house.fill' }}
            md="home"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="(explore)">
          <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="safari.fill" md="explore" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="(items)">
          <NativeTabs.Trigger.Label>Items</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'square.stack', selected: 'square.stack.fill' }}
            md={{ default: 'inventory_2', selected: 'inventory_2' }}
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}
