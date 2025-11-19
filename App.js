import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { AtividadeProvider } from './src/contexts/AtividadeContext';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AtividadeProvider>
          <LoginScreen />
        </AtividadeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}