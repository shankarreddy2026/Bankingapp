import { useRouter } from 'expo-router';
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { MenuSection } from './constants';
import { hexToRgba, isSmallDevice, MENU } from './constants';
import { getMenuShadowStyle, getShadowStyle, getSubmenuShadowStyle } from './shadowStyles';
import { flattenStyleForWeb } from './webSafeStyles';

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
    <View style={flattenStyleForWeb(menuStyles.menuHeader)}>
      <View style={flattenStyleForWeb(menuStyles.menuHeaderTop)}>
        <View style={flattenStyleForWeb(menuStyles.menuTitleContainer)}>
          <View style={flattenStyleForWeb(menuStyles.menuIconContainer)}>
            <Text style={flattenStyleForWeb(menuStyles.menuIcon)}>🏦</Text>
          </View>
          <View style={flattenStyleForWeb(menuStyles.menuTitleTextContainer)}>
            <Text style={flattenStyleForWeb(menuStyles.menuTitleMain)}>Banking</Text>
            <Text style={flattenStyleForWeb(menuStyles.menuTitleSub)}>Menu</Text>
          </View>
        </View>
        <Pressable onPress={onClose} style={flattenStyleForWeb(menuStyles.closeButton)}>
          <Text style={flattenStyleForWeb(menuStyles.closeButtonText)}>×</Text>
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
  onNavigate,
}: {
  section: MenuSection;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const sectionBgColor = isOpen ? hexToRgba(section.color, 0.08) : 'transparent';
  return (
    <View style={flattenStyleForWeb(menuStyles.menuSection)}>
      <Pressable
        onPress={onToggle}
        style={flattenStyleForWeb({ ...menuStyles.sectionHeader, backgroundColor: sectionBgColor })}
      >
        <View style={flattenStyleForWeb(menuStyles.sectionHeaderContent)}>
          <View style={flattenStyleForWeb({ ...menuStyles.sectionIcon, backgroundColor: section.color })}>
            <Text style={flattenStyleForWeb(menuStyles.sectionIconText)}>{section.icon}</Text>
          </View>
          <Text style={flattenStyleForWeb({ ...menuStyles.sectionTitle, ...menuStyles.sectionTitleWithColor, color: section.color })}>
            {section.title}
          </Text>
        </View>
        <View style={flattenStyleForWeb({ ...menuStyles.toggleIcon, backgroundColor: section.color })}>
          <Text style={flattenStyleForWeb(menuStyles.toggleIconText)}>{isOpen ? '−' : '+'}</Text>
        </View>
      </Pressable>
      {isOpen ? (
        <View style={flattenStyleForWeb(menuStyles.submenu)}>
          {section.items.map((item) => {
            const submenuItemStyle = flattenStyleForWeb({
              ...menuStyles.submenuItem,
              borderLeftColor: section.color,
              ...getSubmenuShadowStyle(),
            });
            return (
              <Pressable
                key={item.label}
                style={submenuItemStyle}
                onPress={() => {
                  onClose();
                  onNavigate(item.href);
                }}
              >
                <Text style={flattenStyleForWeb(menuStyles.submenuIcon)}>{item.icon}</Text>
                <Text style={flattenStyleForWeb(menuStyles.submenuText)}>{item.label}</Text>
              </Pressable>
            );
          })}
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
  const router = useRouter();
  const handleNavigate = (href: string) => router.push(href as any);

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
          onNavigate={handleNavigate}
        />
      ))}
    </>
  );

  if (isWebPlatform) {
    const webMenuStyle = flattenStyleForWeb({
      ...menuStyles.sideMenu,
      ...getMenuShadowStyle(),
      ...(menuOpen ? menuStyles.sideMenuOpen : menuStyles.sideMenuClosed),
      transition: 'left 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
    });
    const webMenuScrollStyle = flattenStyleForWeb({
      ...menuStyles.menuScroll,
      ...menuStyles.menuContentContainer,
      overflow: 'scroll' as const,
      flex: 1,
    });
    return (
      <View style={webMenuStyle}>
        <View style={webMenuScrollStyle}>
          {menuContent}
        </View>
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
            onNavigate={handleNavigate}
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
