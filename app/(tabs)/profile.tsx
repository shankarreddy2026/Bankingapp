import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 360;

// Helper functions for platform-specific shadows
const getCardShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 4 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' };
  }
  return {};
};

const BANKING_COLORS = {
  primary: '#2563EB',
  profile: '#8B5CF6',
  cardBg: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  error: '#EF4444',
  border: '#E2E8F0',
  menuBg: '#F1F5F9',
} as const;

export default function ProfileScreen() {
  const { section } = useLocalSearchParams();
  const isViewProfile = !section || section === 'view';
  const isChangePassword = section === 'password';

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data
  const userData = {
    name: 'Siva Sankarad',
    email: 'siva.sankarad@example.com',
    phone: '+91 98765 43210',
    accountNumber: '****1234',
    dateOfBirth: '15/08/1990',
    address: '123 Main Street, City, State - 600001',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '**** **** 5678',
    kycStatus: 'Verified',
    accountOpened: '01/01/2020',
  };

  const validatePassword = () => {
    const errors = {
      current: '',
      new: '',
      confirm: '',
    };

    if (!currentPassword) {
      errors.current = 'Current password is required';
    }

    if (!newPassword) {
      errors.new = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.new = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(newPassword)) {
      errors.new = 'Password must contain uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      errors.confirm = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errors.confirm = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return !errors.current && !errors.new && !errors.confirm;
  };

  const handlePasswordChange = () => {
    if (validatePassword()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Password changed successfully!');
      }, 1500);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: BANKING_COLORS.profile + '20' }]}>
            <Text style={styles.headerIconText}>
              {isViewProfile ? '👤' : '🔒'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {isViewProfile ? 'View Profile' : 'Change Password'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isViewProfile
                ? 'Your account information'
                : 'Update your account password'}
            </Text>
          </View>
        </View>
      </View>

      {isViewProfile ? (
        <>
          {/* Profile Picture Card */}
          <View style={[styles.profileCard, getCardShadowStyle()]}>
            <View style={styles.profilePictureContainer}>
              <View style={styles.profilePicture}>
                <Text style={styles.profilePictureText}>
                  {userData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.profileName}>{userData.name}</Text>
            <View style={styles.kycBadge}>
              <Text style={styles.kycBadgeText}>✓ KYC Verified</Text>
            </View>
            <Pressable style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>

          {/* Personal Information */}
          <View style={[styles.infoCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>👤</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData.name}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📧</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📞</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{userData.dateOfBirth}</Text>
              </View>
            </View>
          </View>

          {/* Account Information */}
          <View style={[styles.infoCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>💳</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Account Number</Text>
                <Text style={styles.infoValue}>{userData.accountNumber}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Account Opened</Text>
                <Text style={styles.infoValue}>{userData.accountOpened}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>✓</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>KYC Status</Text>
                <Text style={[styles.infoValue, { color: BANKING_COLORS.success }]}>
                  {userData.kycStatus}
                </Text>
              </View>
            </View>
          </View>

          {/* Address Information */}
          <View style={[styles.infoCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Address Information</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📍</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Registered Address</Text>
                <Text style={styles.infoValue}>{userData.address}</Text>
              </View>
            </View>
          </View>

          {/* Document Information */}
          <View style={[styles.infoCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Document Information</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📄</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>PAN Number</Text>
                <Text style={styles.infoValue}>{userData.panNumber}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>🆔</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Aadhaar Number</Text>
                <Text style={styles.infoValue}>{userData.aadhaarNumber}</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Password Change Form */}
          <View style={[styles.formCard, getCardShadowStyle()]}>
            <Text style={styles.formTitle}>Change Your Password</Text>
            <Text style={styles.formSubtitle}>
              Please enter your current password and choose a new secure password
            </Text>

            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    passwordErrors.current && styles.inputError,
                  ]}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showPasswords.current}
                  placeholderTextColor={BANKING_COLORS.textSecondary}
                />
                <Pressable
                  style={styles.eyeToggle}
                  onPress={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }>
                  <Text style={styles.eyeIcon}>
                    {showPasswords.current ? '👁️' : '👁'}
                  </Text>
                </Pressable>
              </View>
              {passwordErrors.current ? (
                <Text style={styles.errorText}>{passwordErrors.current}</Text>
              ) : null}
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    passwordErrors.new && styles.inputError,
                  ]}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPasswords.new}
                  placeholderTextColor={BANKING_COLORS.textSecondary}
                />
                <Pressable
                  style={styles.eyeToggle}
                  onPress={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }>
                  <Text style={styles.eyeIcon}>
                    {showPasswords.new ? '👁️' : '👁'}
                  </Text>
                </Pressable>
              </View>
              {passwordErrors.new ? (
                <Text style={styles.errorText}>{passwordErrors.new}</Text>
              ) : null}
              <Text style={styles.helpText}>
                Password must be at least 8 characters with uppercase, lowercase, and number
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    passwordErrors.confirm && styles.inputError,
                  ]}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPasswords.confirm}
                  placeholderTextColor={BANKING_COLORS.textSecondary}
                />
                <Pressable
                  style={styles.eyeToggle}
                  onPress={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }>
                  <Text style={styles.eyeIcon}>
                    {showPasswords.confirm ? '👁️' : '👁'}
                  </Text>
                </Pressable>
              </View>
              {passwordErrors.confirm ? (
                <Text style={styles.errorText}>{passwordErrors.confirm}</Text>
              ) : null}
            </View>

            {/* Submit Button */}
            <Pressable
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handlePasswordChange}
              disabled={isSubmitting}>
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Text>
            </Pressable>

            {/* Security Tips */}
            <View style={styles.securityTips}>
              <Text style={styles.securityTipsTitle}>🔒 Security Tips</Text>
              <Text style={styles.securityTip}>• Use a unique password for your bank account</Text>
              <Text style={styles.securityTip}>• Never share your password with anyone</Text>
              <Text style={styles.securityTip}>• Change password regularly for better security</Text>
              <Text style={styles.securityTip}>• Use a combination of letters, numbers, and symbols</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  header: {
    backgroundColor: BANKING_COLORS.profile,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerIconText: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  profileCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    margin: isSmallDevice ? 16 : 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  profilePictureContainer: {
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BANKING_COLORS.profile,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 12,
  },
  kycBadge: {
    backgroundColor: BANKING_COLORS.success + '20',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  kycBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: BANKING_COLORS.success,
  },
  editButton: {
    backgroundColor: BANKING_COLORS.profile,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    marginHorizontal: isSmallDevice ? 16 : 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BANKING_COLORS.border,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BANKING_COLORS.profile + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: BANKING_COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
  },
  formCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    margin: isSmallDevice ? 16 : 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: BANKING_COLORS.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BANKING_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: BANKING_COLORS.textPrimary,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: BANKING_COLORS.error,
  },
  eyeToggle: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    color: BANKING_COLORS.error,
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: BANKING_COLORS.textSecondary,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: BANKING_COLORS.profile,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  securityTips: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: BANKING_COLORS.border,
  },
  securityTipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 12,
  },
  securityTip: {
    fontSize: 14,
    color: BANKING_COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});
