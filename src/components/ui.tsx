import React, { ReactNode, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { SeasonMap, TimeMap } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/* ───────────────────────── Screen wrapper ───────────────────────── */
export function Screen({
  children,
  scroll = true,
  topInset = false,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  topInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: topInset ? insets.top : 0 };
  if (!scroll) {
    return <View style={[styles.screen, pad, contentStyle]}>{children}</View>;
  }
  return (
    <View style={[styles.screen, pad]}>
      <ScrollView
        contentContainerStyle={[{ paddingBottom: 90 }, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

/* ───────────────────────── Top bar + profile menu ───────────────────────── */
export function TopBar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [open, setOpen] = useState(false);

  const go = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <View style={[styles.topbar, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.logo}>
        Scent<Text style={{ color: colors.accent }}>Day</Text>
      </Text>
      <TouchableOpacity style={[styles.profileIcon, open && { borderColor: colors.accent }]} onPress={() => setOpen(true)}>
        <Text style={styles.profileIconText}>Y</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setOpen(false)}>
          <View style={[styles.dropdown, { top: insets.top + 56 }]}>
            <Text style={styles.dropdownLabel}>YOUR ACCOUNT</Text>
            <MenuItem icon="👤" label="Profile" onPress={() => go(() => navigation.navigate('Profile'))} />
            <MenuItem icon="👥" label="My Communities" onPress={() => go(() => navigation.navigate('Communities'))} />
            <MenuItem icon="❤️" label="Saved Fragrances" onPress={() => go(() => navigation.navigate('Saved'))} />
            <Text style={styles.dropdownLabel}>MORE</Text>
            <MenuItem icon="⚙️" label="Settings" onPress={() => setOpen(false)} last />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function MenuItem({ icon, label, onPress, last }: { icon: string; label: string; onPress: () => void; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.menuItem, last && { borderBottomWidth: 0 }]} onPress={onPress}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ───────────────────────── Back header (stack screens) ───────────────────────── */
export function BackHeader({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  return (
    <TouchableOpacity
      style={[styles.backBtn, { paddingTop: insets.top + 14 }]}
      onPress={onBack || (() => navigation.goBack())}
    >
      <View style={styles.backCircle}>
        <Text style={{ color: '#000', fontSize: 16, fontWeight: '800', marginTop: -2 }}>‹</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ───────────────────────── Chip / Pill ───────────────────────── */
export function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && { color: colors.accent }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ───────────────────────── ScopeTabs (segmented) ───────────────────────── */
export interface TabDef {
  key: string;
  label: string;
}
export function ScopeTabs({
  tabs,
  active,
  onChange,
  scroll = true,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
  scroll?: boolean;
}) {
  const content = tabs.map((t) => (
    <TouchableOpacity
      key={t.key}
      style={[styles.scopeTab, active === t.key && styles.scopeTabActive, !scroll && { flex: 1 }]}
      onPress={() => onChange(t.key)}
    >
      <Text style={[styles.scopeTabText, active === t.key && { color: colors.accent }]}>{t.label}</Text>
    </TouchableOpacity>
  ));
  if (!scroll) return <View style={styles.scopeRow}>{content}</View>;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scopeRow}>
      {content}
    </ScrollView>
  );
}

/* ───────────────────────── Buttons ───────────────────────── */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity style={[styles.primaryBtn, disabled && { opacity: 0.4 }, style]} onPress={onPress} disabled={disabled}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ───────────────────────── SectionCard ───────────────────────── */
export function SectionCard({ title, right, children }: { title?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <View style={styles.section}>
      {(title || right) && (
        <View style={styles.sectionHead}>
          {title ? <Text style={styles.sectionTitle}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

/* ───────────────────────── Performance bar ───────────────────────── */
export function Bar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.barLabelRow}>
        <Text style={{ color: colors.text, fontSize: 13 }}>{label}</Text>
        <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '800' }}>{`${value}/${max}`}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(value / max) * 100}%` }]} />
      </View>
    </View>
  );
}

/* ───────────────────────── Season / time quad grid ───────────────────────── */
export function Quad({ data }: { data: SeasonMap | TimeMap | Record<string, number> }) {
  return (
    <View style={styles.quad}>
      {Object.entries(data).map(([k, v]) => (
        <View key={k} style={styles.quadCell}>
          <Text style={styles.quadLabel}>{k}</Text>
          <View style={styles.quadTrack}>
            <View style={[styles.quadFill, { width: `${v}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

/* ───────────────────────── Avatar ───────────────────────── */
export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.42 }]}>{(name[0] || '?').toUpperCase()}</Text>
    </View>
  );
}

/* ───────────────────────── EmptyState ───────────────────────── */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{children}</Text>
    </View>
  );
}

export const text = (s: TextStyle) => s;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.bg,
  },
  logo: { fontSize: 22, fontWeight: '900', letterSpacing: -1, color: colors.text },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.line,
  },
  profileIconText: { color: '#000', fontSize: 20, fontWeight: '800' },
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  dropdown: {
    position: 'absolute',
    right: 16,
    minWidth: 220,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  dropdownLabel: { color: colors.textDim, fontSize: 12, paddingHorizontal: 16, paddingVertical: 10, letterSpacing: 0.4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  menuItemText: { color: colors.text, fontSize: 14 },
  backBtn: { paddingHorizontal: 18, paddingBottom: 4, alignSelf: 'flex-start' },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  chipText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  pill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  pillActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  pillText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  scopeRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  scopeTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  scopeTabActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  scopeTabText: { color: colors.textDim, fontSize: 13, fontWeight: '700' },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 9,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: colors.textDim, fontSize: 11, letterSpacing: 1, fontWeight: '800', textTransform: 'uppercase' },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  track: { height: 8, backgroundColor: colors.surface2, borderRadius: 10, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: 10 },
  quad: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quadCell: { backgroundColor: colors.surface2, borderRadius: 12, padding: 10, width: '47%', flexGrow: 1 },
  quadLabel: { fontSize: 12, color: colors.textDim, marginBottom: 6 },
  quadTrack: { height: 6, backgroundColor: colors.bg, borderRadius: 8, overflow: 'hidden' },
  quadFill: { height: '100%', backgroundColor: colors.accent },
  avatar: { backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.accent, fontWeight: '700' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: colors.textDim, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export { styles as uiStyles };
