import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader, PrimaryButton } from '@/components/ui';
import { useStore } from '@/store/useStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SuggestFragranceScreen() {
  const navigation = useNavigation<Nav>();
  const submitSuggestion = useStore((s) => s.submitSuggestion);
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [top, setTop] = useState('');
  const [mid, setMid] = useState('');
  const [base, setBase] = useState('');

  const onSubmit = () => {
    if (!brand.trim() || !name.trim()) {
      Alert.alert('Missing details', 'Please fill in brand and fragrance name.');
      return;
    }
    submitSuggestion();
    navigation.navigate('SuggestDone');
  };

  return (
    <Screen>
      <BackHeader />
      <View style={{ paddingHorizontal: 18 }}>
        <Text style={styles.h2}>Suggest a Fragrance</Text>
        <Text style={styles.subtitle}>Help us grow the database. Our team will verify and add it shortly.</Text>

        <Field label="Brand Name *" value={brand} onChange={setBrand} placeholder="e.g. Creed" />
        <Field label="Fragrance Name *" value={name} onChange={setName} placeholder="e.g. Aventus" />
        <Field label="Top Notes (optional)" value={top} onChange={setTop} placeholder="e.g. Bergamot, Apple" />
        <Field label="Middle Notes (optional)" value={mid} onChange={setMid} placeholder="e.g. Rose, Jasmine" />
        <Field label="Base Notes (optional)" value={base} onChange={setBase} placeholder="e.g. Sandalwood, Musk" />

        <PrimaryButton label="Submit Suggestion" onPress={onSubmit} style={{ marginTop: 18 }} />
      </View>
    </Screen>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (t: string) => void; placeholder: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.textDim} />
    </View>
  );
}

const styles = StyleSheet.create({
  h2: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: colors.textDim, fontSize: 13, marginBottom: 18 },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontSize: 14 },
});
