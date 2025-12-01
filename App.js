import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { AtividadeProvider } from './src/contexts/AtividadeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AtividadeProvider>
          <AppNavigator />
        </AtividadeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}