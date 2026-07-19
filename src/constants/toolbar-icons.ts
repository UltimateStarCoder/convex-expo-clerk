import AccountCircleIcon from '@expo/material-symbols/account_circle.xml';
import AddIcon from '@expo/material-symbols/add.xml';
import DescriptionIcon from '@expo/material-symbols/description.xml';
import LogoutIcon from '@expo/material-symbols/logout.xml';
import ManageAccountsIcon from '@expo/material-symbols/manage_accounts.xml';

export const toolbarIcons = {
  account: process.env.EXPO_OS === 'ios' ? 'person.crop.circle' : AccountCircleIcon,
  add: process.env.EXPO_OS === 'ios' ? 'plus' : AddIcon,
  documentation: process.env.EXPO_OS === 'android' ? DescriptionIcon : undefined,
  manageAccount: process.env.EXPO_OS === 'ios' ? 'person.crop.circle' : ManageAccountsIcon,
  signOut:
    process.env.EXPO_OS === 'ios' ? 'rectangle.portrait.and.arrow.right' : LogoutIcon,
} as const;
