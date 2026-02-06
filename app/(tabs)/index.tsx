import { LinearGradient } from 'expo-linear-gradient';
import { Link, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Helper to create safe platform styles
const createPlatformStyle = (baseStyle: any, platformOverrides?: { android?: any; ios?: any; web?: any }) => {
  if (!platformOverrides) return baseStyle;
  const platformStyle = platformOverrides[Platform.OS as keyof typeof platformOverrides] || {};
  return { ...baseStyle, ...platformStyle };
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isSmallDevice = SCREEN_WIDTH < 360;
const isWeb = Platform.OS === 'web';

// Helper to safely get platform-specific styles without spreading
const getPlatformStyle = (android: any, ios: any, web: any) => {
  if (isWeb) return web || {};
  if (Platform.OS === 'android') return android || {};
  if (Platform.OS === 'ios') return ios || {};
  return {};
};

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Modern Banking color palette
const BANKING_COLORS = {
  primary: '#2563EB', // Vibrant blue
  primaryDark: '#1E40AF', // Deep blue
  primaryLight: '#60A5FA', // Light blue
  secondary: '#10B981', // Emerald green
  accent: '#F59E0B', // Amber/Gold
  success: '#10B981', // Success green
  warning: '#F59E0B', // Warning orange
  error: '#EF4444', // Error red
  cardBg: '#FFFFFF',
  menuBg: '#F1F5F9', // Light slate
  menuBgDark: '#0F172A', // Dark slate for menu
  textPrimary: '#1E293B', // Slate 800
  textSecondary: '#64748B', // Slate 500
  border: '#E2E8F0', // Slate 200
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  account: '#3B82F6', // Blue for Account section
  profile: '#8B5CF6', // Purple for Profile section
  money: '#F59E0B', // Gold for Money section
  gradientStart: '#2563EB', // Gradient start
  gradientEnd: '#1E40AF', // Gradient end
} as const;

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

type RoutePath = '/account' | '/profile' | '/money';

interface MenuSection {
  title: string;
  icon: string;
  color: string;
  items: MenuItem[];
}

const MENU: MenuSection[] = [
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

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Password validation function
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Transaction data type
interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  icon: string;
  iconColor: string;
}

// Generate hard-coded transaction data
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const transactionTypes = [
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

  const amounts = [
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

  const daysAgo = [
    'Today',
    'Yesterday',
    '2 days ago',
    '3 days ago',
    '4 days ago',
    '5 days ago',
    '6 days ago',
    '1 week ago',
    '2 weeks ago',
    '3 weeks ago',
  ];
  const times = [
    '9:30 AM',
    '2:15 PM',
    '11:45 AM',
    '4:20 PM',
    '8:10 AM',
    '1:30 PM',
    '6:45 PM',
    '10:20 AM',
    '3:15 PM',
    '7:50 AM',
  ];

  for (let i = 0; i < 100; i++) {
    const typeIndex = i % transactionTypes.length;
    const amountIndex = Math.floor(i / 10);
    const transactionType = transactionTypes[typeIndex];
    const amountSet = amounts[amountIndex % amounts.length];

    const isCredit = transactionType.type === 'credit';
    const amountOptions = isCredit ? amountSet.credit : amountSet.debit;
    const amount = amountOptions[i % amountOptions.length];

    const dayIndex = Math.floor(i / 10);
    const timeIndex = i % times.length;

    transactions.push({
      id: `trans-${i + 1}`,
      title: transactionType.title,
      date: `${daysAgo[dayIndex % daysAgo.length]}, ${times[timeIndex]}`,
      amount: amount,
      type: transactionType.type,
      icon: transactionType.icon,
      iconColor: transactionType.iconColor,
    });
  }

  return transactions;
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['Account']));
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showAllTransactions, setShowAllTransactions] = useState<boolean>(false);
  const [loadedTransactionCount, setLoadedTransactionCount] = useState<number>(10);
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);

  // Generate all transactions
  const allTransactions = useMemo(() => generateTransactions(), []);
  const displayedTransactions = useMemo(
    () => allTransactions.slice(0, loadedTransactionCount),
    [allTransactions, loadedTransactionCount]
  );

  // Use Animated only on native platforms, use regular state for web
  const menuSlideAnim = useState(new Animated.Value(-300))[0];
  const overlayOpacity = useState(new Animated.Value(0))[0];

  // Validate email
  const validateEmail = (emailValue: string) => {
    if (!touched.email) return;
    if (emailValue.trim().length === 0) {
      setEmailError('Email is required');
    } else if (!isValidEmail(emailValue)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Validate password
  const validatePassword = (passwordValue: string) => {
    if (!touched.password) return;
    if (passwordValue.length === 0) {
      setPasswordError('Password is required');
    } else if (!isValidPassword(passwordValue)) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (touched.email) {
      validateEmail(text);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (touched.password) {
      validatePassword(text);
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    validatePassword(password);
  };

  const canLogin = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.length > 0 &&
      isValidEmail(email) &&
      isValidPassword(password) &&
      !emailError &&
      !passwordError
    );
  }, [email, password, emailError, passwordError]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const newMenuState = !prev;

      if (isWeb) {
        // Web will use CSS transitions defined in styles
        return newMenuState;
      }

      // Smooth animations for native platforms with easing
      const toValue = newMenuState ? 0 : -300;
      const overlayValue = newMenuState ? 1 : 0;

      Animated.parallel([
        Animated.spring(menuSlideAnim, {
          toValue,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: overlayValue,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      return newMenuState;
    });
  }, [menuSlideAnim, overlayOpacity]);

  const closeMenu = () => {
    if (menuOpen) {
      toggleMenu();
    }
  };

  // Set up header with hamburger menu button
  useLayoutEffect(() => {
    if (loggedIn) {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable
            style={styles.headerMenuButton}
            onPress={toggleMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.headerMenuIcon}>
              <View style={[styles.headerMenuLine, menuOpen ? styles.headerMenuLineActive : null]} />
              <View style={[styles.headerMenuLine, menuOpen ? styles.headerMenuLineActive : null]} />
              <View style={[styles.headerMenuLine, menuOpen ? styles.headerMenuLineActive : null]} />
            </View>
          </Pressable>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: undefined,
      });
    }
  }, [loggedIn, menuOpen, navigation, toggleMenu]);

  return (
    <View style={styles.page}>
      {!loggedIn ? (
        <KeyboardAvoidingView
          style={styles.loginContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <LinearGradient
            colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginGradient}
          >
            <View style={styles.loginContentWrapper}>
              <View style={styles.loginHeader}>
                <View style={styles.logoWrapper}>
                  <LinearGradient colors={['#FFFFFF', '#F3F4F6']} style={styles.logoGradient}>
                    <Text style={styles.logoText}>🏦</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.loginTitle}>Welcome Back</Text>
                <Text style={styles.loginSubtitle}>Sign in to access your account</Text>
              </View>

              <View style={styles.loginCard}>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.modernInput,
                      touched.email && emailError && styles.inputError,
                      touched.email && !emailError && email.length > 0 && styles.inputValid,
                    ]}
                    placeholder="Email Address"
                    placeholderTextColor={BANKING_COLORS.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                </View>
                {touched.email && emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <View style={[styles.inputWrapper, { marginTop: 20 }]}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.modernInput,
                      touched.password && passwordError && styles.inputError,
                      touched.password && !passwordError && password.length > 0 && styles.inputValid,
                    ]}
                    placeholder="Password"
                    placeholderTextColor={BANKING_COLORS.textSecondary}
                    secureTextEntry
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                  />
                </View>
                {touched.password && passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <Pressable
                  style={[styles.modernLoginButton, !canLogin && styles.loginButtonDisabled]}
                  disabled={!canLogin}
                  onPress={() => {
                    setTouched({ email: true, password: true });
                    validateEmail(email);
                    validatePassword(password);

                    if (canLogin) {
                      setLoggedIn(true);
                    }
                  }}
                >
                  <LinearGradient
                    colors={!canLogin ? ['#E5E7EB', '#D1D5DB'] : ['#1E40AF', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.modernLoginButtonText}>Sign In</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.homeShell}>
          {/* Overlay with smooth fade animation */}
          {isWeb ? (
            menuOpen && <Pressable style={[styles.overlay, { opacity: menuOpen ? 1 : 0 }]} onPress={closeMenu} />
          ) : (
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: overlayOpacity,
                },
              ]}
            >
              <Pressable style={styles.overlayPressable} onPress={closeMenu} />
            </Animated.View>
          )}

          {/* Side Menu with smooth slide animation */}
          {isWeb ? (
            <View
              style={[
                styles.sideMenu,
                menuOpen ? styles.sideMenuOpen : styles.sideMenuClosed,
                getMenuShadowStyle(),
                isWeb &&
                  ({
                    transition: 'left 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  } as any),
              ]}
            >
              <FlatList
                data={MENU}
                keyExtractor={(item) => item.title}
                ListHeaderComponent={() => (
                  <View style={styles.menuHeader}>
                    <View style={styles.menuHeaderTop}>
                      <View style={styles.menuTitleContainer}>
                        <View style={styles.menuIconContainer}>
                          <Text style={styles.menuIcon}>🏦</Text>
                        </View>
                        <View style={styles.menuTitleTextContainer}>
                          <Text style={styles.menuTitleMain}>Banking</Text>
                          <Text style={styles.menuTitleSub}>Menu</Text>
                        </View>
                      </View>
                      <Pressable onPress={closeMenu} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>×</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.menuContentContainer}
                showsVerticalScrollIndicator={true}
                renderItem={({ item: section }) => {
                  const isOpen = openSections.has(section.title);
                  const sectionBgColor = isOpen ? hexToRgba(section.color, 0.08) : 'transparent';
                  return (
                    <View style={styles.menuSection}>
                      <Pressable
                        onPress={() => toggleSection(section.title)}
                        style={StyleSheet.flatten([styles.sectionHeader, { backgroundColor: sectionBgColor }])}
                      >
                        <View style={styles.sectionHeaderContent}>
                          <View style={StyleSheet.flatten([styles.sectionIcon, { backgroundColor: section.color }])}>
                            <Text style={styles.sectionIconText}>{section.icon}</Text>
                          </View>
                          <Text
                            style={StyleSheet.flatten([
                              styles.sectionTitle,
                              styles.sectionTitleWithColor,
                              { color: section.color },
                            ])}
                          >
                            {section.title}
                          </Text>
                        </View>
                        <View style={StyleSheet.flatten([styles.toggleIcon, { backgroundColor: section.color }])}>
                          <Text style={styles.toggleIconText}>{isOpen ? '−' : '+'}</Text>
                        </View>
                      </Pressable>
                      {isOpen ? (
                        <View style={styles.submenu}>
                          {section.items.map((item) => {
                            const href = item.href as any;
                            return (
                              <Link key={item.label} href={href} asChild>
                                <Pressable
                                  style={StyleSheet.flatten([
                                    styles.submenuItem,
                                    { borderLeftColor: section.color },
                                    getSubmenuShadowStyle(),
                                  ])}
                                  onPress={closeMenu}
                                >
                                  <Text style={styles.submenuIcon}>{item.icon}</Text>
                                  <Text style={styles.submenuText}>{item.label}</Text>
                                </Pressable>
                              </Link>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <Animated.View
              style={[
                styles.sideMenu,
                {
                  transform: [{ translateX: menuSlideAnim }],
                },
              ]}
            >
              <FlatList
                data={MENU}
                keyExtractor={(item) => item.title}
                ListHeaderComponent={() => (
                  <View style={styles.menuHeader}>
                    <View style={styles.menuHeaderTop}>
                      <View style={styles.menuTitleContainer}>
                        <View style={styles.menuIconContainer}>
                          <Text style={styles.menuIcon}>🏦</Text>
                        </View>
                        <View style={styles.menuTitleTextContainer}>
                          <Text style={styles.menuTitleMain}>Banking</Text>
                          <Text style={styles.menuTitleSub}>Menu</Text>
                        </View>
                      </View>
                      <Pressable onPress={closeMenu} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>×</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.menuContentContainer}
                showsVerticalScrollIndicator={true}
                renderItem={({ item: section }) => {
                  const isOpen = openSections.has(section.title);
                  const sectionBgColor = isOpen ? hexToRgba(section.color, 0.08) : 'transparent';
                  return (
                    <View style={styles.menuSection}>
                      <Pressable
                        onPress={() => toggleSection(section.title)}
                        style={StyleSheet.flatten([styles.sectionHeader, { backgroundColor: sectionBgColor }])}
                      >
                        <View style={styles.sectionHeaderContent}>
                          <View style={StyleSheet.flatten([styles.sectionIcon, { backgroundColor: section.color }])}>
                            <Text style={styles.sectionIconText}>{section.icon}</Text>
                          </View>
                          <Text
                            style={StyleSheet.flatten([
                              styles.sectionTitle,
                              styles.sectionTitleWithColor,
                              { color: section.color },
                            ])}
                          >
                            {section.title}
                          </Text>
                        </View>
                        <View style={StyleSheet.flatten([styles.toggleIcon, { backgroundColor: section.color }])}>
                          <Text style={styles.toggleIconText}>{isOpen ? '−' : '+'}</Text>
                        </View>
                      </Pressable>
                      {isOpen ? (
                        <View style={styles.submenu}>
                          {section.items.map((item) => {
                            const href = item.href as any;
                            return (
                              <Link key={item.label} href={href} asChild>
                                <Pressable
                                  style={StyleSheet.flatten([
                                    styles.submenuItem,
                                    { borderLeftColor: section.color },
                                    getSubmenuShadowStyle(),
                                  ])}
                                  onPress={closeMenu}
                                >
                                  <Text style={styles.submenuIcon}>{item.icon}</Text>
                                  <Text style={styles.submenuText}>{item.label}</Text>
                                </Pressable>
                              </Link>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  );
                }}
              />
            </Animated.View>
          )}
          <FlatList
            style={styles.contentPane}
            contentContainerStyle={styles.contentScrollContent}
            showsVerticalScrollIndicator={false}
            data={[
              { id: 'welcome', type: 'welcome' },
              { id: 'balance', type: 'balance' },
              { id: 'quick-actions', type: 'quick-actions' },
              { id: 'transactions', type: 'transactions' },
            ]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if (item.type === 'welcome') {
                return (
                  <LinearGradient
                    colors={[BANKING_COLORS.primary, BANKING_COLORS.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.welcomeCard}
                  >
                    <View style={styles.welcomeContent}>
                      <Text style={styles.welcomeGreeting}>Account Overview 💼</Text>
                      <Text style={styles.welcomeSubtext}>Manage your finances securely</Text>
                    </View>
                  </LinearGradient>
                );
              }
              if (item.type === 'balance') {
                return (
                  <View style={[styles.balanceCard, getCardShadowStyle()]}>
                    <View style={styles.balanceHeader}>
                      <Text style={styles.balanceLabel}>Total Balance</Text>
                      <Pressable
                        onPress={() => setBalanceVisible(!balanceVisible)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.balanceEye}>{balanceVisible ? '👁️' : '🔒'}</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.balanceAmount}>{balanceVisible ? '$45,231.89' : '••••••'}</Text>
                    <View style={styles.balanceFooter}>
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceItemLabel}>Savings</Text>
                        <Text style={styles.balanceItemValue}>{balanceVisible ? '$28,450.00' : '••••••'}</Text>
                      </View>
                      <View style={styles.balanceDivider} />
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceItemLabel}>Current</Text>
                        <Text style={styles.balanceItemValue}>{balanceVisible ? '$16,781.89' : '••••••'}</Text>
                      </View>
                    </View>
                  </View>
                );
              }
              if (item.type === 'quick-actions') {
                return (
                  <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActions}>
                      <Pressable style={[styles.quickActionCard, getQuickActionShadowStyle()]}>
                        <LinearGradient
                          colors={[BANKING_COLORS.primary, BANKING_COLORS.primaryLight]}
                          style={styles.quickActionGradient}
                        >
                          <Text style={styles.quickActionIcon}>💳</Text>
                          <Text style={styles.quickActionText}>Accounts</Text>
                        </LinearGradient>
                      </Pressable>
                      <Pressable style={[styles.quickActionCard, getQuickActionShadowStyle()]}>
                        <LinearGradient
                          colors={[BANKING_COLORS.secondary, '#34D399']}
                          style={styles.quickActionGradient}
                        >
                          <Text style={styles.quickActionIcon}>📊</Text>
                          <Text style={styles.quickActionText}>Transactions</Text>
                        </LinearGradient>
                      </Pressable>
                      <Pressable style={[styles.quickActionCard, getQuickActionShadowStyle()]}>
                        <LinearGradient colors={[BANKING_COLORS.accent, '#FBBF24']} style={styles.quickActionGradient}>
                          <Text style={styles.quickActionIcon}>💰</Text>
                          <Text style={styles.quickActionText}>Balance</Text>
                        </LinearGradient>
                      </Pressable>
                    </View>
                  </View>
                );
              }
              if (item.type === 'transactions') {
                return (
                  <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                      <Text style={styles.sectionTitle}>Recent Transactions</Text>
                      <Pressable
                        onPress={() => {
                          setShowAllTransactions(true);
                          setLoadedTransactionCount(10);
                        }}
                      >
                        <Text style={styles.viewAllText}>View All</Text>
                      </Pressable>
                    </View>
                    <View style={[styles.transactionCard, getCardShadowStyle()]}>
                      <View style={styles.transactionItem}>
                        <View
                          style={[
                            styles.transactionIcon,
                            { backgroundColor: hexToRgba(BANKING_COLORS.secondary, 0.1) },
                          ]}
                        >
                          <Text style={styles.transactionIconText}>📥</Text>
                        </View>
                        <View style={styles.transactionDetails}>
                          <Text style={styles.transactionTitle}>Salary Deposit</Text>
                          <Text style={styles.transactionDate}>Today, 9:30 AM</Text>
                        </View>
                        <Text style={[styles.transactionAmount, { color: BANKING_COLORS.success }]}>+$3,500.00</Text>
                      </View>
                      <View style={styles.transactionDivider} />
                      <View style={styles.transactionItem}>
                        <View
                          style={[styles.transactionIcon, { backgroundColor: hexToRgba(BANKING_COLORS.error, 0.1) }]}
                        >
                          <Text style={styles.transactionIconText}>📤</Text>
                        </View>
                        <View style={styles.transactionDetails}>
                          <Text style={styles.transactionTitle}>Electric Bill</Text>
                          <Text style={styles.transactionDate}>Yesterday, 2:15 PM</Text>
                        </View>
                        <Text style={[styles.transactionAmount, { color: BANKING_COLORS.error }]}>-$125.50</Text>
                      </View>
                      <View style={styles.transactionDivider} />
                      <View style={styles.transactionItem}>
                        <View
                          style={[styles.transactionIcon, { backgroundColor: hexToRgba(BANKING_COLORS.primary, 0.1) }]}
                        >
                          <Text style={styles.transactionIconText}>💳</Text>
                        </View>
                        <View style={styles.transactionDetails}>
                          <Text style={styles.transactionTitle}>Grocery Store</Text>
                          <Text style={styles.transactionDate}>2 days ago</Text>
                        </View>
                        <Text style={[styles.transactionAmount, { color: BANKING_COLORS.error }]}>-$87.23</Text>
                      </View>
                    </View>
                  </View>
                );
              }
              return null;
            }}
          />
        </View>
      )}

      {/* View All Transactions Modal */}
      <Modal
        visible={showAllTransactions}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAllTransactions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>All Transactions</Text>
            <Pressable onPress={() => setShowAllTransactions(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
          </View>
          <FlatList
            data={displayedTransactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={true}
            onEndReached={() => {
              if (loadedTransactionCount < 100) {
                setLoadedTransactionCount((prev) => Math.min(prev + 10, 100));
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => {
              if (loadedTransactionCount >= 100) {
                return (
                  <View style={styles.loadingFooter}>
                    <Text style={styles.loadingFooterText}>All transactions loaded</Text>
                  </View>
                );
              }
              return (
                <View style={styles.loadingFooter}>
                  <Text style={styles.loadingFooterText}>Loading more...</Text>
                </View>
              );
            }}
            renderItem={({ item }) => (
              <View style={[styles.modalTransactionItem, getCardShadowStyle()]}>
                <View style={styles.modalTransactionRow}>
                  <View style={[styles.modalTransactionIcon, { backgroundColor: hexToRgba(item.iconColor, 0.1) }]}>
                    <Text style={styles.modalTransactionIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.modalTransactionDetails}>
                    <Text style={styles.modalTransactionTitle}>{item.title}</Text>
                    <Text style={styles.modalTransactionDate}>{item.date}</Text>
                  </View>
                  <Text
                    style={[
                      styles.modalTransactionAmount,
                      { color: item.type === 'credit' ? BANKING_COLORS.success : BANKING_COLORS.error },
                    ]}
                  >
                    {item.type === 'credit' ? '+' : '-'}${item.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

// Platform-specific shadow styles (avoid spreading Platform.select in StyleSheet)
const getShadowStyle = () => {
  if (Platform.OS === 'android') {
    return { elevation: 8 };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)' };
  }
  return {};
};

const getCardShadowStyle = () => {
  if (Platform.OS === 'android') {
    return { elevation: 12 };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.25)' };
  }
  return {};
};

const getButtonShadowStyle = () => {
  if (Platform.OS === 'android') {
    return { elevation: 4 };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '0px 4px 6px rgba(30, 64, 175, 0.3)' };
  }
  return {};
};

const getMenuShadowStyle = () => {
  if (Platform.OS === 'android') {
    return { elevation: 10 };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.2)' };
  }
  return {};
};

const getSubmenuShadowStyle = () => {
  if (Platform.OS === 'android') {
    return { elevation: 2 };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' };
  }
  return {};
};

const getQuickActionShadowStyle = () => {
  if (Platform.OS === 'android') {
    return { elevation: 4 };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.3)' };
  }
  return {};
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  // Login Screen Styles - Modern Theme
  loginContainer: {
    flex: 1,
  },
  loginGradient: {
    flex: 1,
    width: '100%',
  },
  loginContentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(),
  },
  logoText: {
    fontSize: 48,
  },
  loginTitle: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 32 : 36,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  loginSubtitle: {
    color: '#FFFFFF',
    opacity: 0.95,
    fontSize: isSmallDevice ? 15 : 17,
    textAlign: 'center',
    fontWeight: '400',
  },
  loginCard: {
    width: '100%',
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 24,
    padding: 28,
    ...getCardShadowStyle(),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BANKING_COLORS.border,
    paddingHorizontal: 4,
    minHeight: 56,
  },
  inputIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: 20,
  },
  modernInput: {
    flex: 1,
    fontSize: isSmallDevice ? 15 : 16,
    color: BANKING_COLORS.textPrimary,
    paddingVertical: Platform.OS === 'android' ? 14 : 16,
    paddingRight: 16,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputValid: {
    borderColor: BANKING_COLORS.success,
    backgroundColor: '#F0FDF4',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 52,
    fontWeight: '500',
  },
  modernLoginButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    ...getButtonShadowStyle(),
  },
  buttonGradient: {
    paddingVertical: Platform.OS === 'android' ? 16 : 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  modernLoginButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 17 : 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Home Screen Styles
  homeShell: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BANKING_COLORS.overlay,
    zIndex: 998,
  },
  overlayPressable: {
    flex: 1,
  },
  headerMenuButton: {
    marginLeft: Platform.OS === 'ios' ? -4 : 4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  headerMenuIcon: {
    width: 22,
    height: 16,
    justifyContent: 'space-between',
  },
  headerMenuLine: {
    width: 22,
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  headerMenuLineActive: {
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: BANKING_COLORS.cardBg,
    zIndex: 999,
  },
  menuContentContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 56,
    paddingBottom: 20,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  sideMenuOpen: {
    left: 0,
  },
  sideMenuClosed: {
    left: -300,
  },
  menuHeader: {
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: BANKING_COLORS.border,
    marginBottom: 24,
    paddingTop: 12,
    backgroundColor: BANKING_COLORS.menuBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: -4,
  },
  menuHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BANKING_COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitleTextContainer: {
    flex: 1,
  },
  menuTitleMain: {
    color: BANKING_COLORS.primary,
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  menuTitleSub: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BANKING_COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BANKING_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  closeButtonText: {
    color: BANKING_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '300',
  },
  menuSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(),
  },
  sectionIconText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 17 : 19,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionTitleWithColor: {
    marginLeft: 12,
  },
  toggleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(),
  },
  toggleIconText: {
    color: BANKING_COLORS.cardBg,
    fontSize: 18,
    fontWeight: 'bold',
  },
  submenu: {
    marginTop: 8,
    marginLeft: 52,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: BANKING_COLORS.menuBg,
    borderLeftWidth: 4,
    marginBottom: 10,
    ...getSubmenuShadowStyle(),
  },
  submenuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  submenuText: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 15 : 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  contentPane: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  contentScrollContent: {
    padding: isSmallDevice ? 16 : 20,
    paddingBottom: 40,
  },
  welcomeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    ...getCardShadowStyle(),
  },
  welcomeContent: {
    alignItems: 'flex-start',
  },
  welcomeGreeting: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 26 : 32,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  welcomeSubtext: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 14 : 16,
    opacity: 0.95,
  },
  balanceCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  balanceEye: {
    fontSize: 22,
    padding: 4,
  },
  balanceAmount: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 36 : 42,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -1,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BANKING_COLORS.border,
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceItemLabel: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 12 : 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  balanceItemValue: {
    color: BANKING_COLORS.primary,
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: BANKING_COLORS.border,
    marginHorizontal: 16,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: isSmallDevice ? 100 : 110,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  quickActionGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickActionIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  quickActionText: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 13 : 15,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: BANKING_COLORS.primary,
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 22,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 12 : 13,
  },
  transactionAmount: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
  },
  transactionDivider: {
    height: 1,
    backgroundColor: BANKING_COLORS.border,
    marginVertical: 4,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: BANKING_COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: BANKING_COLORS.border,
    ...getShadowStyle(),
  },
  modalTitle: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: '700',
    color: BANKING_COLORS.textPrimary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BANKING_COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BANKING_COLORS.border,
  },
  modalCloseText: {
    color: BANKING_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '300',
  },
  modalContent: {
    padding: 16,
    paddingBottom: 32,
  },
  modalTransactionItem: {
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalTransactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTransactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTransactionIconText: {
    fontSize: 22,
  },
  modalTransactionDetails: {
    flex: 1,
  },
  modalTransactionTitle: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalTransactionDate: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 12 : 13,
  },
  modalTransactionAmount: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingFooterText: {
    color: BANKING_COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
