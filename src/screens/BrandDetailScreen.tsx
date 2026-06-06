import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, BackHeader } from '@/components/ui';
import { FragRow } from '@/components/FragRow';
import { fragsByBrand } from '@/services/catalog';
import { brandLogoUris } from '@/data/brandLogos';
import { LogoImage } from '@/components/LogoImage';

type Props = NativeStackScreenProps<RootStackParamList, 'BrandDetail'>;

export default function BrandDetailScreen({ route, navigation }: Props) {
  const { brand } = route.params;
  const frags = fragsByBrand(brand);

  return (
    <Screen>
      <BackHeader />
      <View style={styles.header}>
        <LogoImage uris={brandLogoUris(brand)} name={brand} size={80} radius={16} />
        <Text style={styles.name}>{brand}</Text>
        <Text style={styles.sub}>{`${frags.length} fragrances in database`}</Text>
      </View>
      {frags.map((f) => (
        <FragRow key={f.id} fragrance={f} onPress={() => navigation.push('FragranceDetail', { fragId: f.id })} />
      ))}
      <View style={{ height: 16 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingVertical: 20, gap: 10 },
  name: { color: colors.text, fontSize: 22, fontWeight: '800' },
  sub: { color: colors.textDim, fontSize: 13 },
});
