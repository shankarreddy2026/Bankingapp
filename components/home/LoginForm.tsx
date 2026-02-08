import { GradientView } from './GradientView';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BANKING_COLORS, isSmallDevice, isValidEmail, isValidPassword } from './constants';
import { getButtonShadowStyle, getCardShadowStyle } from './shadowStyles';

interface LoginFormProps {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  touched: { email: boolean; password: boolean };
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  onLogin: () => void;
}

export function LoginForm({
  email,
  password,
  emailError,
  passwordError,
  touched,
  onEmailChange,
  onPasswordChange,
  onEmailBlur,
  onPasswordBlur,
  onLogin,
}: LoginFormProps) {
  const canLogin =
    email.trim().length > 0 &&
    password.length > 0 &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    !emailError &&
    !passwordError;

  return (
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
          onChangeText={onEmailChange}
          onBlur={onEmailBlur}
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
          onChangeText={onPasswordChange}
          onBlur={onPasswordBlur}
        />
      </View>
      {touched.password && passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <Pressable
        style={[styles.modernLoginButton, !canLogin && styles.loginButtonDisabled]}
        disabled={!canLogin}
        onPress={onLogin}
      >
        <GradientView
          colors={!canLogin ? ['#E5E7EB', '#D1D5DB'] : ['#1E40AF', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.modernLoginButtonText}>Sign In</Text>
        </GradientView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
