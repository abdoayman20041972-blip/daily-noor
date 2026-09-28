import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, useColorScheme, AppState, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ayahs, hadiths, adhkar } from './src/data';
import { themes } from './src/theme';

// رقم اليوم (بالتوقيت المحلي) — بيتغير كل منتصف ليل
function dayNumber() {
  const d = new Date();
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}
function todayLabel() {
  try {
    return new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch (e) {
    return '';
  }
}

const TABS = [
  { key: 'ayah', label: 'آية اليوم', icon: '﴿﴾' },
  { key: 'hadith', label: 'حديث اليوم', icon: '❝❞' },
  { key: 'dhikr', label: 'ذكر اليوم', icon: '✦' },
];

function Screen({ tab, day, c }) {
  const accent = c[tab];
  let body;
  if (tab === 'ayah') {
    const a = ayahs[day % ayahs.length];
    body = (
      <>
        <Text style={[styles.ornament, { color: accent }]}>﴿</Text>
        <Text style={[styles.ayahText, { color: c.text }]}>{a.t}</Text>
        <Text style={[styles.ornament, { color: accent }]}>﴾</Text>
        <Text style={[styles.source, { color: accent }]}>{a.s}</Text>
      </>
    );
  } else if (tab === 'hadith') {
    const h = hadiths[day % hadiths.length];
    body = (
      <>
        <Text style={[styles.quoteMark, { color: accent }]}>❝</Text>
        <Text style={[styles.hadithText, { color: c.text }]}>{h.t}</Text>
        <View style={[styles.divider, { backgroundColor: accent }]} />
        <Text style={[styles.narrator, { color: c.sub }]}>{h.n}</Text>
        <Text style={[styles.source, { color: accent }]}>{h.s}</Text>
      </>
    );
  } else {
    const z = adhkar[day % adhkar.length];
    body = (
      <>
        <Text style={[styles.star, { color: accent }]}>✦</Text>
        <Text style={[styles.dhikrText, { color: c.text }]}>{z.t}</Text>
        <View style={[styles.badge, { borderColor: accent }]}>
          <Text style={[styles.badgeText, { color: accent }]}>{z.r}</Text>
        </View>
        <Text style={[styles.source, { color: c.sub }]}>{z.s}</Text>
      </>
    );
  }
  const title = TABS.find((t) => t.key === tab).label;
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={[styles.title, { color: accent }]}>{title}</Text>
      <Text style={[styles.date, { color: c.sub }]}>{todayLabel()}</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: accent }]}>{body}</View>
    </ScrollView>
  );
}

function Main() {
  const scheme = useColorScheme();
  const c = themes[scheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('ayah');
  const [day, setDay] = useState(dayNumber());

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') setDay(dayNumber());
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        <Screen tab={tab} day={day} c={c} />
      </View>
      <View style={[styles.tabBar, { backgroundColor: c.tabBg, borderTopColor: c.border, paddingBottom: Math.max(insets.bottom, 8) }]}>
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Pressable key={t.key} style={styles.tab} onPress={() => setTab(t.key)}>
              <Text style={[styles.tabIcon, { color: active ? c[t.key] : c.sub }]}>{t.icon}</Text>
              <Text style={[styles.tabLabel, { color: active ? c[t.key] : c.sub, fontWeight: active ? '700' : '400' }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

const serif = Platform.select({ android: 'serif', ios: 'Times New Roman' });

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  date: { fontSize: 15, marginTop: 4, marginBottom: 24, textAlign: 'center' },
  card: { width: '100%', borderWidth: 1.5, borderRadius: 24, paddingVertical: 32, paddingHorizontal: 22, alignItems: 'center' },
  ornament: { fontSize: 36, lineHeight: 44 },
  ayahText: { fontSize: 30, lineHeight: 56, textAlign: 'center', fontFamily: serif, writingDirection: 'rtl' },
  quoteMark: { fontSize: 40, lineHeight: 48 },
  hadithText: { fontSize: 24, lineHeight: 44, textAlign: 'center', writingDirection: 'rtl' },
  divider: { width: 60, height: 2, borderRadius: 1, marginVertical: 18 },
  narrator: { fontSize: 15, textAlign: 'center' },
  source: { fontSize: 16, marginTop: 10, fontWeight: '600', textAlign: 'center' },
  star: { fontSize: 32, marginBottom: 12 },
  dhikrText: { fontSize: 28, lineHeight: 50, textAlign: 'center', fontWeight: '600', writingDirection: 'rtl' },
  badge: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 16, marginTop: 20 },
  badgeText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  tabBar: { flexDirection: 'row-reverse', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  tabIcon: { fontSize: 22, lineHeight: 28 },
  tabLabel: { fontSize: 13, marginTop: 2 },
});
