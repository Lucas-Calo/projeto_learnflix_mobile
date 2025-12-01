import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import AlunoDashboardScreen from '../screens/AlunoDashboard';
import ProfessorDashboardScreen from '../screens/ProfessorDashboard'; 
import GestorDashboardScreen from '../screens/GestorDashboard'; 

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>        
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {user.profile === 'Aluno' && (
              <Stack.Screen name="AlunoDashboard" component={AlunoDashboardScreen} />
            )}
            {user.profile === 'Professor' && (
              <Stack.Screen name="ProfessorDashboard" component={ProfessorDashboardScreen} />
            )}
            {user.profile === 'Gestor' && (
              <Stack.Screen name="GestorDashboard" component={GestorDashboardScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}