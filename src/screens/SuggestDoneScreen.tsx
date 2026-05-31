import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, PrimaryButton } from '@/components/ui';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SuggestDoneScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <Screen scroll={false} topInset>
      <View style={styles.wrap}>
        <Text style={styles.check}>✅</Text>
        <Text style={styles.h2}>Thanks for the suggestion!</Text>
        <Text style={styles.body}>
          Our team will review this submission and confirm its details before adding it to the database. We aim to review all
          suggestions within 48 hours.
        </Text>
        <Text style={styles.drops}>+20 Drops for your contribution 🎉</Text>
        <PrimaryButton label="Back to Home" onPress={() => navigation.navigate('Tabs', { screen: 'Home' })} style={{ paddingHorizontal: 32, alignSelf: 'center' }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  check: { fontSize: 64, marginBottom: 16 },
  h2: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  body: { color: colors.textDim, fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  drops: { color: colors.accent, fontSize: 14, fontWeight: '700', marginBottom: 28, textAlign: 'center' },
});
