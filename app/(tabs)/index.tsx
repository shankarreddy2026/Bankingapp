import React, { useMemo, useState } from 'react';
import { Animated, Dimensions, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';

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

export default function HomeScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['Account']));
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
  // Use Animated only on native platforms, use regular state for web
  const menuSlideAnim = useState(new Animated.Value(-280))[0];
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

  const toggleMenu = () => {
    if (isWeb) {
      // Simple state toggle for web - no animations to avoid CSS issues
      setMenuOpen(!menuOpen);
    } else {
      // Use animations on native platforms
      const toValue = menuOpen ? -280 : 0;
      const overlayValue = menuOpen ? 0 : 1;
      
      Animated.parallel([
        Animated.timing(menuSlideAnim, {
          toValue,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: overlayValue,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      setMenuOpen(!menuOpen);
    }
  };

  const closeMenu = () => {
    if (menuOpen) {
      toggleMenu();
    }
  };

  return (
    <View style={styles.page}>
      {!loggedIn ? (
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <View style={[styles.logoContainer, getShadowStyle()]}>
              <Text style={styles.logoText}>🏦</Text>
            </View>
            <Text style={styles.loginTitle}>Bank Login</Text>
            <Text style={styles.loginSubtitle}>
              Secure access to your banking services
            </Text>
          </View>
          <View style={[styles.loginCard, getCardShadowStyle()]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
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
              {touched.email && emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
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
              {touched.password && passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>
            <Pressable
              style={[
                styles.loginButton,
                !canLogin && styles.loginButtonDisabled,
                !canLogin ? {} : getButtonShadowStyle(),
              ]}
              disabled={!canLogin}
              onPress={() => {
                // Validate both fields before login
                setTouched({ email: true, password: true });
                validateEmail(email);
                validatePassword(password);
                
                if (canLogin) {
                  setLoggedIn(true);
                }
              }}>
              <Text style={styles.loginButtonText}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.homeShell}>
          {/* Overlay - Simple View for web to avoid CSS errors */}
          {menuOpen && (
            <View style={styles.overlay}>
              <Pressable style={styles.overlayPressable} onPress={closeMenu} />
            </View>
          )}
          
          {/* Hamburger Menu Button */}
          <Pressable style={[styles.hamburgerButton, getShadowStyle()]} onPress={toggleMenu}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </Pressable>

          {/* Side Menu - Simple View for web, Animated for native */}
          {isWeb ? (
            <View
              style={[
                styles.sideMenu,
                menuOpen ? styles.sideMenuOpen : styles.sideMenuClosed,
                getMenuShadowStyle(),
              ]}>
              <View style={styles.menuHeader}>
                <View style={styles.menuHeaderTop}>
                  <Text style={styles.menuTitle}>
                    🏦 Banking Menu
                  </Text>
                  <Pressable onPress={closeMenu} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>
              </View>
              {MENU.map((section) => {
                const isOpen = openSections.has(section.title);
                const sectionBgColor = isOpen ? hexToRgba(section.color, 0.08) : 'transparent';
                return (
                  <View key={section.title} style={styles.menuSection}>
                    <Pressable 
                      onPress={() => toggleSection(section.title)} 
                      style={StyleSheet.flatten([
                        styles.sectionHeader,
                        { backgroundColor: sectionBgColor },
                      ])}>
                      <View style={styles.sectionHeaderContent}>
                      <View style={StyleSheet.flatten([styles.sectionIcon, { backgroundColor: section.color }])}>
                        <Text style={styles.sectionIconText}>{section.icon}</Text>
                      </View>
                      <Text style={StyleSheet.flatten([styles.sectionTitle, styles.sectionTitleWithColor, { color: section.color }])}>
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
                          const href = item.href.split('?')[0] as any;
                          return (
                            <Link key={item.label} href={href} asChild>
                              <Pressable style={StyleSheet.flatten([
                                styles.submenuItem,
                                { borderLeftColor: section.color },
                                getSubmenuShadowStyle(),
                              ])} onPress={closeMenu}>
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
              })}
            </View>
          ) : (
            <Animated.View
              style={[
                styles.sideMenu,
                {
                  transform: [{ translateX: menuSlideAnim }],
                },
              ]}>
              <View style={styles.menuHeader}>
                <View style={styles.menuHeaderTop}>
                  <Text style={styles.menuTitle}>
                    🏦 Banking Menu
                  </Text>
                  <Pressable onPress={closeMenu} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>
              </View>
              {MENU.map((section) => {
                const isOpen = openSections.has(section.title);
                const sectionBgColor = isOpen ? hexToRgba(section.color, 0.08) : 'transparent';
                return (
                  <View key={section.title} style={styles.menuSection}>
                    <Pressable 
                      onPress={() => toggleSection(section.title)} 
                      style={StyleSheet.flatten([
                        styles.sectionHeader,
                        { backgroundColor: sectionBgColor },
                      ])}>
                      <View style={styles.sectionHeaderContent}>
                      <View style={StyleSheet.flatten([styles.sectionIcon, { backgroundColor: section.color }])}>
                        <Text style={styles.sectionIconText}>{section.icon}</Text>
                      </View>
                      <Text style={StyleSheet.flatten([styles.sectionTitle, styles.sectionTitleWithColor, { color: section.color }])}>
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
                          const href = item.href.split('?')[0] as any;
                          return (
                            <Link key={item.label} href={href} asChild>
                              <Pressable style={StyleSheet.flatten([
                                styles.submenuItem,
                                { borderLeftColor: section.color },
                                getSubmenuShadowStyle(),
                              ])} onPress={closeMenu}>
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
              })}
            </Animated.View>
          )}
          <View style={styles.contentPane}>
            <View style={styles.contentHeader}>
              <Text style={styles.contentTitle}>Welcome Back! 👋</Text>
              <Text style={styles.contentSubtitle}>
                Your banking dashboard
              </Text>
            </View>
            <View style={styles.quickActions}>
              <View style={[styles.quickActionCard, getQuickActionShadowStyle()]}>
                <Text style={styles.quickActionIcon}>💳</Text>
                <Text style={styles.quickActionText}>Accounts</Text>
              </View>
              <View style={[styles.quickActionCard, getQuickActionShadowStyle()]}>
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Transactions</Text>
              </View>
              <View style={[styles.quickActionCard, getQuickActionShadowStyle()]}>
                <Text style={styles.quickActionIcon}>💰</Text>
                <Text style={styles.quickActionText}>Balance</Text>
              </View>
            </View>
            <Text style={styles.contentText}>
              Choose an item from the side menu to access your banking services.
            </Text>
          </View>
        </View>
      )}
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
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallDevice ? 16 : 24,
    backgroundColor: BANKING_COLORS.primary,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BANKING_COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  loginTitle: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 28 : 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loginSubtitle: {
    color: BANKING_COLORS.cardBg,
    opacity: 0.9,
    fontSize: isSmallDevice ? 14 : 16,
    textAlign: 'center',
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 20,
    padding: isSmallDevice ? 20 : 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BANKING_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 14 : 16,
    fontSize: isSmallDevice ? 15 : 16,
    backgroundColor: BANKING_COLORS.cardBg,
    color: BANKING_COLORS.textPrimary,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputValid: {
    borderColor: BANKING_COLORS.success,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: Platform.OS === 'android' ? 16 : 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: BANKING_COLORS.primary,
  },
  loginButtonDisabled: {
    backgroundColor: BANKING_COLORS.border,
  },
  loginButtonText: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
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
  hamburgerButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 999,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BANKING_COLORS.primary,
    borderRadius: 10,
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: BANKING_COLORS.cardBg,
    marginVertical: 3,
    borderRadius: 2,
  },
  hamburgerLineOpen: {
    backgroundColor: BANKING_COLORS.cardBg,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: BANKING_COLORS.cardBg,
    padding: isSmallDevice ? 12 : 16,
    zIndex: 999,
  },
  sideMenuOpen: {
    left: 0,
  },
  sideMenuClosed: {
    left: -280,
  },
  menuHeader: {
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: BANKING_COLORS.primary,
    marginBottom: 16,
  },
  menuHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    color: BANKING_COLORS.primary,
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BANKING_COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: BANKING_COLORS.cardBg,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
  },
  sectionTitleWithColor: {
    marginLeft: 12,
  },
  toggleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIconText: {
    color: BANKING_COLORS.cardBg,
    fontSize: 18,
    fontWeight: 'bold',
  },
  submenu: {
    marginTop: 4,
    marginLeft: 48,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: BANKING_COLORS.menuBg,
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  submenuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  submenuText: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '500',
  },
  contentPane: {
    flex: 1,
    backgroundColor: BANKING_COLORS.cardBg,
    padding: isSmallDevice ? 16 : 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 70,
  },
  contentHeader: {
    marginBottom: 8,
  },
  contentTitle: {
    color: BANKING_COLORS.primary,
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentSubtitle: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 14 : 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  quickActionCard: {
    flex: 1,
    minWidth: isSmallDevice ? 100 : 120,
    backgroundColor: BANKING_COLORS.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 12 : 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  contentText: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 14 : 16,
    lineHeight: 24,
  },
});
