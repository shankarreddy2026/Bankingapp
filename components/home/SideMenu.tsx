import { Link } from 'expo-router';
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { hexToRgba, MENU } from './constants';
import type { MenuSection } from './constants';
import { getShadowStyle, getSubmenuShadowStyle } from './shadowStyles';
import { isSmallDevice } from './constants';
import { getMenuShadowStyle } from './shadowStyles';

interface SideMenuProps {
  isWeb: boolean;
  menuOpen: boolean;
  menuSlideAnim?: Animated.Value;
  openSection: string | null;
  onToggleSection: (title: string) => void;
  onClose: () => void;
}

function MenuHeader({ onClose }: { onClose: () => void }) {
  return (
    <View style={menuStyles.menuHeader}>
      <View style={menuStyles.menuHeaderTop}>
        <View style={menuStyles.menuTitleContainer}>
          <View style={menuStyles.menuIconContainer}>
            <Text style={menuStyles.menuIcon}>🏦</Text>
          </View>
          <View style={menuStyles.menuTitleTextContainer}>
            <Text style={menuStyles.menuTitleMain}>Banking</Text>
            <Text style={menuStyles.menuTitleSub}>Menu</Text>
          </View>
        </View>
        <Pressable onPress={onClose} style={menuStyles.closeButton}>
          <Text style={menuStyles.closeButtonText}>×</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MenuSectionRow({
  section,
  isOpen,
  onToggle,
  onClose,
}: {
  section: MenuSection;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const sectionBgColor = isOpen ? hexToRgba(section.color, 0.08) : 'transparent';
  return (
    <View style={menuStyles.menuSection}>
      <Pressable
        onPress={onToggle}
        style={[menuStyles.sectionHeader, { backgroundColor: sectionBgColor }]}
      >
        <View style={menuStyles.sectionHeaderContent}>
          <View style={[menuStyles.sectionIcon, { backgroundColor: section.color }]}>
            <Text style={menuStyles.sectionIconText}>{section.icon}</Text>
          </View>
          <Text style={[menuStyles.sectionTitle, menuStyles.sectionTitleWithColor, { color: section.color }]}>
            {section.title}
          </Text>
        </View>
        <View style={[menuStyles.toggleIcon, { backgroundColor: section.color }]}>
          <Text style={menuStyles.toggleIconText}>{isOpen ? '−' : '+'}</Text>
        </View>
      </Pressable>
      {isOpen ? (
        <View style={menuStyles.submenu}>
          {section.items.map((item) => (
            <Link key={item.label} href={item.href as any} asChild>
              <Pressable
                style={[
                  menuStyles.submenuItem,
                  { borderLeftColor: section.color },
                  getSubmenuShadowStyle(),
                ]}
                onPress={onClose}
              >
                <Text style={menuStyles.submenuIcon}>{item.icon}</Text>
                <Text style={menuStyles.submenuText}>{item.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function SideMenu({
  isWeb: isWebPlatform,
  menuOpen,
  menuSlideAnim,
  openSection,
  onToggleSection,
  onClose,
}: SideMenuProps) {
  const menuContent = (
    <>
      <MenuHeader onClose={onClose} />
      {MENU.map((section) => (
        <MenuSectionRow
          key={section.title}
          section={section}
          isOpen={openSection === section.title}
          onToggle={() => onToggleSection(section.title)}
          onClose={onClose}
        />
      ))}
    </>
  );

  const baseMenuStyle = [
    menuStyles.sideMenu,
    getMenuShadowStyle(),
  ];

  if (isWebPlatform) {
    return (
      <View
        style={[
          baseMenuStyle,
          menuOpen ? menuStyles.sideMenuOpen : menuStyles.sideMenuClosed,
          { transition: 'left 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)' } as any,
        ]}
      >
        <ScrollView
          style={menuStyles.menuScroll}
          contentContainerStyle={menuStyles.menuContentContainer}
          showsVerticalScrollIndicator={true}
        >
          {menuContent}
        </ScrollView>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        menuStyles.sideMenu,
        { transform: menuSlideAnim ? [{ translateX: menuSlideAnim }] : [] },
      ]}
    >
      <FlatList
        data={MENU}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={() => <MenuHeader onClose={onClose} />}
        contentContainerStyle={menuStyles.menuContentContainer}
        showsVerticalScrollIndicator={true}
        renderItem={({ item: section }) => (
          <MenuSectionRow
            section={section}
            isOpen={openSection === section.title}
            onToggle={() => onToggleSection(section.title)}
            onClose={onClose}
          />
        )}
      />
    </Animated.View>
  );
}

const menuStyles = StyleSheet.create({
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  sideMenuOpen: {
    left: 0,
  },
  sideMenuClosed: {
    left: -300,
  },
  menuScroll: {
    flex: 1,
  },
  menuContentContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 56,
    paddingBottom: 20,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  menuHeader: {
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    marginBottom: 24,
    paddingTop: 12,
    backgroundColor: '#F1F5F9',
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
    backgroundColor: '#2563EB15',
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
    color: '#2563EB',
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  menuTitleSub: {
    color: '#64748B',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  closeButtonText: {
    color: '#1E293B',
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
    color: '#FFFFFF',
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
    backgroundColor: '#F1F5F9',
    borderLeftWidth: 4,
    marginBottom: 10,
  },
  submenuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  submenuText: {
    color: '#1E293B',
    fontSize: isSmallDevice ? 15 : 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
