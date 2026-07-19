import { useMutation } from 'convex/react';
import { useEffect } from 'react';

import { api } from '@/../convex/_generated/api';

export function CurrentUserSync() {
  const storeCurrentUser = useMutation(api.users.storeCurrent);

  useEffect(() => {
    void storeCurrentUser().catch((error: unknown) => {
      console.error('Could not sync the current user with Convex.', error);
    });
  }, [storeCurrentUser]);

  return null;
}
