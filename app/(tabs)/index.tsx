import { GradientView } from '../../components/home/GradientView';
import { useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AllTransactionsModal } from '../../components/home/AllTransactionsModal';
import { BalanceCard } from '../../components/home/BalanceCard';
import { LoginForm } from '../../components/home/LoginForm';
import { QuickActionsSection } from '../../components/home/QuickActionsSection';
import { RecentTransactionsSection } from '../../components/home/RecentTransactionsSection';
import { SideMenu } from '../../components/home/SideMenu';
import { WelcomeCard } from '../../components/home/WelcomeCard';
import {
  BANKING_COLORS,
  generateTransactions,
  isSmallDevice,
  isValidEmail,
  isValidPassword,
} from '../../components/home/constants';
import { getShadowStyle } from '../../components/home/shadowStyles';
import { flattenStyleForWeb } from '../../components/home/webSafeStyles';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('Account');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [loadedTransactionCount, setLoadedTransactionCount] = useState(10);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const allTransactions = useMemo(() => generateTransactions(), []);
  const isWeb = Platform.OS === 'web';

  const menuSlideAnim = useState(new Animated.Value(-300))[0];
  const overlayOpacity = useState(new Animated.Value(0))[0];

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
    if (touched.email) validateEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (touched.password) validatePassword(text);
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    validatePassword(password);
  };

  const canLogin = useMemo(
    () =>
      email.trim().length > 0 &&
      password.length > 0 &&
      isValidEmail(email) &&
      isValidPassword(password) &&
      !emailError &&
      !passwordError,
    [email, password, emailError, passwordError]
  );

  const handleLogin = () => {
    setTouched({ email: true, password: true });
    validateEmail(email);
    validatePassword(password);
    if (canLogin) setLoggedIn(true);
  };

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const newMenuState = !prev;
      if (isWeb) return newMenuState;
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
    if (menuOpen) toggleMenu();
  };

  useLayoutEffect(() => {
    if (loggedIn) {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable
            style={isWeb ? flattenStyleForWeb(styles.headerMenuButton) : styles.headerMenuButton}
            onPress={toggleMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={isWeb ? flattenStyleForWeb(styles.headerMenuIcon) : styles.headerMenuIcon}>
              <View style={isWeb ? flattenStyleForWeb(menuOpen ? { ...styles.headerMenuLine, ...styles.headerMenuLineActive } : styles.headerMenuLine) : (menuOpen ? { ...styles.headerMenuLine, ...styles.headerMenuLineActive } : styles.headerMenuLine)} />
              <View style={isWeb ? flattenStyleForWeb(menuOpen ? { ...styles.headerMenuLine, ...styles.headerMenuLineActive } : styles.headerMenuLine) : (menuOpen ? { ...styles.headerMenuLine, ...styles.headerMenuLineActive } : styles.headerMenuLine)} />
              <View style={isWeb ? flattenStyleForWeb(menuOpen ? { ...styles.headerMenuLine, ...styles.headerMenuLineActive } : styles.headerMenuLine) : (menuOpen ? { ...styles.headerMenuLine, ...styles.headerMenuLineActive } : styles.headerMenuLine)} />
            </View>
          </Pressable>
        ),
      });
    } else {
      navigation.setOptions({ headerLeft: undefined });
    }
  }, [loggedIn, menuOpen, navigation, toggleMenu]);

  return (
    <View style={isWeb ? flattenStyleForWeb(styles.page) : styles.page}>
      {!loggedIn ? (
        <KeyboardAvoidingView
          style={styles.loginContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <GradientView
            colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginGradient}
          >
            <View style={styles.loginContentWrapper}>
              <View style={styles.loginHeader}>
                <View style={styles.logoWrapper}>
                  <GradientView colors={['#FFFFFF', '#F3F4F6']} style={styles.logoGradient}>
                    <Text style={styles.logoText}>🏦</Text>
                  </GradientView>
                </View>
                <Text style={styles.loginTitle}>Welcome Back</Text>
                <Text style={styles.loginSubtitle}>Sign in to access your account</Text>
              </View>
              <LoginForm
                email={email}
                password={password}
                emailError={emailError}
                passwordError={passwordError}
                touched={touched}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onEmailBlur={handleEmailBlur}
                onPasswordBlur={handlePasswordBlur}
                onLogin={handleLogin}
              />
            </View>
          </GradientView>
        </KeyboardAvoidingView>
      ) : (
        <View style={isWeb ? flattenStyleForWeb(styles.homeShell) : styles.homeShell}>
          {isWeb ? (
            menuOpen && (
              <Pressable
                style={flattenStyleForWeb({ ...styles.overlay, opacity: menuOpen ? 1 : 0 })}
                onPress={closeMenu}
              />
            )
          ) : (
            <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
              <Pressable style={styles.overlayPressable} onPress={closeMenu} />
            </Animated.View>
          )}

          <SideMenu
            isWeb={isWeb}
            menuOpen={menuOpen}
            menuSlideAnim={!isWeb ? menuSlideAnim : undefined}
            openSection={openSection}
            onToggleSection={toggleSection}
            onClose={closeMenu}
          />

          {isWeb ? (
            <View style={flattenStyleForWeb({ ...styles.contentPane, ...styles.contentScrollContent, overflow: 'scroll', flex: 1 })}>
              <WelcomeCard />
              <BalanceCard
                balanceVisible={balanceVisible}
                onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
              />
              <QuickActionsSection />
              <RecentTransactionsSection
                onViewAll={() => {
                  setShowAllTransactions(true);
                  setLoadedTransactionCount(10);
                }}
              />
            </View>
          ) : (
            <ScrollView
              style={styles.contentPane}
              contentContainerStyle={styles.contentScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <WelcomeCard />
              <BalanceCard
                balanceVisible={balanceVisible}
                onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
              />
              <QuickActionsSection />
              <RecentTransactionsSection
                onViewAll={() => {
                  setShowAllTransactions(true);
                  setLoadedTransactionCount(10);
                }}
              />
            </ScrollView>
          )}
        </View>
      )}

      <AllTransactionsModal
        visible={showAllTransactions}
        onClose={() => setShowAllTransactions(false)}
        transactions={allTransactions}
        loadedCount={loadedTransactionCount}
        onLoadMore={() => {
          if (loadedTransactionCount < 100) {
            setLoadedTransactionCount((prev) => Math.min(prev + 10, 100));
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
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
  contentPane: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  contentScrollContent: {
    padding: isSmallDevice ? 16 : 20,
    paddingBottom: 40,
  },
});
