import { UserProfileView } from '@clerk/expo/native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <UserProfileView
      isDismissible
      onDismiss={() => router.back()}
      style={{ flex: 1 }}
    />
  );
}
