import React from 'react';
import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

import BottomTabs from '@/navigation/BottomTabs';
import FragranceDetailScreen from '@/screens/FragranceDetailScreen';
import NoteDetailScreen from '@/screens/NoteDetailScreen';
import BrandDetailScreen from '@/screens/BrandDetailScreen';
import PostScreen from '@/screens/PostScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import PostHistoryScreen from '@/screens/PostHistoryScreen';
import CommunitiesScreen from '@/screens/CommunitiesScreen';
import CommunityDetailScreen from '@/screens/CommunityDetailScreen';
import SavedScreen from '@/screens/SavedScreen';
import WardrobeScreen from '@/screens/WardrobeScreen';
import SuggestFragranceScreen from '@/screens/SuggestFragranceScreen';
import SuggestDoneScreen from '@/screens/SuggestDoneScreen';
import UserProfileScreen from '@/screens/UserProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    border: colors.line,
    text: colors.text,
    primary: colors.accent,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen name="FragranceDetail" component={FragranceDetailScreen} />
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
        <Stack.Screen name="BrandDetail" component={BrandDetailScreen} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PostHistory" component={PostHistoryScreen} />
        <Stack.Screen name="Communities" component={CommunitiesScreen} />
        <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
        <Stack.Screen name="SuggestFragrance" component={SuggestFragranceScreen} />
        <Stack.Screen name="SuggestDone" component={SuggestDoneScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
