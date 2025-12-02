import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';

// Dashboards
import AlunoDashboardScreen from '../screens/AlunoDashboard';
import ProfessorDashboardScreen from '../screens/ProfessorDashboard';
import GestorDashboardScreen from '../screens/GestorDashboard';

// Funcionalidades
import DetalhesAtividadeScreen from '../screens/DetalhesAtividadeScreen';
import CriarAtividadeScreen from '../screens/CriarAtividadeScreen'; 
import CameraScreen from '../screens/CameraScreen'; 

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a1b9a" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {/* Dashboards */}
            {user.profile === 'Aluno' && (
              <Stack.Screen name="AlunoDashboard" component={AlunoDashboardScreen} />
            )}
            {user.profile === 'Professor' && (
              <Stack.Screen name="ProfessorDashboard" component={ProfessorDashboardScreen} />
            )}
            {user.profile === 'Gestor' && (
              <Stack.Screen name="GestorDashboard" component={GestorDashboardScreen} />
            )}
            
            {/* Telas Comuns */}
            <Stack.Screen name="DetalhesAtividade" component={DetalhesAtividadeScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            
            {/* Tela de Criação*/}
            {user.profile === 'Professor' && (
               <Stack.Screen name="CriarAtividade" component={CriarAtividadeScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0f9',
  },
});