import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation';

/**
 * App entry point.
 * The phone "frame" from the HTML prototype is no longer needed — on a real
 * device the navigator simply fills the screen. Global providers live here.
 *
 * TODO (extensibility): wrap with a persistence/auth provider here when you
 *   add a real backend (e.g. <AuthProvider>, <QueryClientProvider>).
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
