import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '@/theme';
import type { TabParamList } from '@/navigation/types';
import { Fab } from '@/components/Fab';

import HomeScreen from '@/screens/HomeScreen';
import FeedScreen from '@/screens/FeedScreen';
import DiscoverScreen from '@/screens/DiscoverScreen';
import LayeringScreen from '@/screens/LayeringScreen';
import RankingsScreen from '@/screens/RankingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, string> = {
  Discover: '💎',
  Feed: '📸',
  Home: '🏠',
  Blend: '🧬',
  Ranks: '🏆',
};

const LABELS: Record<keyof TabParamList, string> = {
  Discover: 'Discover',
  Feed: 'Feed',
  Home: 'Home',
  Blend: 'Blend',
  Ranks: 'Ranks',
};

function TabBarIcon({ route, focused }: { route: keyof TabParamList; focused: boolean }) {
  const isHome = route === 'Home';
  return (
    <View style={styles.iconWrap}>
      <View style={[isHome && styles.homeBubble]}>
        <Text style={[styles.icon, isHome && styles.homeIcon, focused && !isHome && { opacity: 1 }]}>{ICONS[route]}</Text>
      </View>
      <Text style={[styles.label, { color: focused ? colors.accent : colors.textDim }]}>{LABELS[route]}</Text>
    </View>
  );
}

/**
 * Bottom tabs: Discover · Feed · Home (raised) · Blend · Ranks.
 * The Fab (post menu) floats above the tab bar on every tab.
 */
export default function BottomTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => <TabBarIcon route={route.name as keyof TabParamList} focused={focused} />,
        })}
      >
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Blend" component={LayeringScreen} />
        <Tab.Screen name="Ranks" component={RankingsScreen} />
      </Tab.Navigator>
      <Fab />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    height: 66,
    paddingTop: 6,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 64, gap: 3 },
  icon: { fontSize: 22 },
  homeBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  homeIcon: { fontSize: 22 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
});
