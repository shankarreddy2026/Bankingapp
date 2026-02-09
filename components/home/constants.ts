import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const isTablet = SCREEN_WIDTH >= 768;
export const isSmallDevice = SCREEN_WIDTH < 360;
export const isWeb = Platform.OS === 'web';

export const BANKING_COLORS = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#60A5FA',
  secondary: '#10B981',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  cardBg: '#FFFFFF',
  menuBg: '#F1F5F9',
  menuBgDark: '#0F172A',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  account: '#3B82F6',
  profile: '#8B5CF6',
  money: '#F59E0B',
  gradientStart: '#2563EB',
  gradientEnd: '#1E40AF',
} as const;

export interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

export type RoutePath = '/account' | '/profile' | '/money';

export interface MenuSection {
  title: string;
  icon: string;
  color: string;
  items: MenuItem[];
}

export const MENU: MenuSection[] = [
  {
    title: 'Account',
    icon: '💳',
    color: BANKING_COLORS.account,
    items: [
      { label: 'Saving', href: '/account?type=saving', icon: '💰' },
      { label: 'Current', href: '/account?type=current', icon: '💵' },
    ],
  },
  {
    title: 'Profile',
    icon: '👤',
    color: BANKING_COLORS.profile,
    items: [
      { label: 'View Profile', href: '/profile?section=view', icon: '👁️' },
      { label: 'Change Password', href: '/profile?section=password', icon: '🔒' },
    ],
  },
  {
    title: 'Money',
    icon: '💸',
    color: BANKING_COLORS.money,
    items: [
      { label: 'NTF', href: '/money?type=ntf', icon: '📊' },
      { label: 'ILF', href: '/money?type=ilf', icon: '📈' },
      { label: 'IMPLS', href: '/money?type=impls', icon: '💼' },
    ],
  },
];

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export interface Transaction {
  id: string;
  title: string;
  date: string;
  dateISO: string;
  amount: number;
  type: 'credit' | 'debit';
  icon: string;
  iconColor: string;
}

const TRANSACTION_TYPES = [
  { title: 'Salary Deposit', icon: '📥', iconColor: BANKING_COLORS.secondary, type: 'credit' as const },
  { title: 'Electric Bill', icon: '📤', iconColor: BANKING_COLORS.error, type: 'debit' as const },
  { title: 'Grocery Store', icon: '💳', iconColor: BANKING_COLORS.primary, type: 'debit' as const },
  { title: 'ATM Withdrawal', icon: '🏧', iconColor: BANKING_COLORS.textSecondary, type: 'debit' as const },
  { title: 'Online Transfer', icon: '💸', iconColor: BANKING_COLORS.accent, type: 'debit' as const },
  { title: 'Investment Return', icon: '📈', iconColor: BANKING_COLORS.success, type: 'credit' as const },
  { title: 'Restaurant Payment', icon: '🍽️', iconColor: BANKING_COLORS.error, type: 'debit' as const },
  { title: 'Freelance Payment', icon: '💼', iconColor: BANKING_COLORS.secondary, type: 'credit' as const },
  { title: 'Gas Station', icon: '⛽', iconColor: BANKING_COLORS.warning, type: 'debit' as const },
  { title: 'Bank Interest', icon: '💰', iconColor: BANKING_COLORS.success, type: 'credit' as const },
];

const AMOUNTS = [
  { credit: [3500, 2500, 1800, 1200, 950], debit: [125.5, 87.23, 245.8, 67.9, 189.45] },
  { credit: [4200, 3200, 2100, 1500, 1100], debit: [156.3, 98.75, 312.4, 78.2, 234.6] },
  { credit: [3800, 2900, 1950, 1350, 1025], debit: [142.15, 92.5, 278.9, 71.35, 201.8] },
  { credit: [4100, 3100, 2050, 1450, 1075], debit: [148.25, 95.6, 295.7, 74.8, 218.4] },
  { credit: [3600, 2700, 1850, 1250, 975], debit: [132.4, 89.15, 261.3, 69.5, 192.25] },
  { credit: [4400, 3300, 2200, 1600, 1150], debit: [162.5, 101.9, 328.6, 81.45, 247.8] },
  { credit: [3700, 2800, 1900, 1300, 1000], debit: [138.2, 91.3, 270.5, 72.1, 197.6] },
  { credit: [4300, 3200, 2150, 1550, 1125], debit: [154.75, 97.4, 304.2, 76.65, 226.9] },
  { credit: [3900, 3000, 2000, 1400, 1050], debit: [144.6, 93.85, 284.1, 73.25, 210.15] },
  { credit: [4000, 3050, 2025, 1425, 1062], debit: [146.35, 94.7, 287.5, 73.9, 212.95] },
];

const DAYS_AGO = [
  'Today', 'Yesterday', '2 days ago', '3 days ago', '4 days ago',
  '5 days ago', '6 days ago', '1 week ago', '2 weeks ago', '3 weeks ago',
];

const TIMES = [
  '9:30 AM', '2:15 PM', '11:45 AM', '4:20 PM', '8:10 AM',
  '1:30 PM', '6:45 PM', '10:20 AM', '3:15 PM', '7:50 AM',
];

export function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  for (let i = 0; i < 100; i++) {
    const typeIndex = i % TRANSACTION_TYPES.length;
    const amountIndex = Math.floor(i / 10);
    const transactionType = TRANSACTION_TYPES[typeIndex];
    const amountSet = AMOUNTS[amountIndex % AMOUNTS.length];
    const isCredit = transactionType.type === 'credit';
    const amountOptions = isCredit ? amountSet.credit : amountSet.debit;
    const amount = amountOptions[i % amountOptions.length];
    const dayIndex = Math.floor(i / 10);
    const timeIndex = i % TIMES.length;
    const txDate = new Date(today);
    txDate.setDate(txDate.getDate() - dayIndex);
    const dateISO = txDate.toISOString().slice(0, 10);
    transactions.push({
      id: `trans-${i + 1}`,
      title: transactionType.title,
      date: `${DAYS_AGO[dayIndex % DAYS_AGO.length]}, ${TIMES[timeIndex]}`,
      dateISO,
      amount,
      type: transactionType.type,
      icon: transactionType.icon,
      iconColor: transactionType.iconColor,
    });
  }
  return transactions;
}
