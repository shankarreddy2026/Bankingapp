import { Platform } from 'react-native';
import { BANKING_COLORS } from './constants';

export const getShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 8 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    };
  }
  if (Platform.OS === 'web') return { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)' };
  return {};
};

export const getCardShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 12 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    };
  }
  if (Platform.OS === 'web') return { boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.25)' };
  return {};
};

export const getButtonShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 4 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    };
  }
  if (Platform.OS === 'web') return { boxShadow: '0px 4px 6px rgba(30, 64, 175, 0.3)' };
  return {};
};

export const getMenuShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 10 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    };
  }
  if (Platform.OS === 'web') return { boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.2)' };
  return {};
};

export const getSubmenuShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 2 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    };
  }
  if (Platform.OS === 'web') return { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' };
  return {};
};

export const getQuickActionShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 4 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: BANKING_COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    };
  }
  if (Platform.OS === 'web') return { boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.3)' };
  return {};
};
