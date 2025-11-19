import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    const response = await login(email, password);
    if (response.success) {
      console.log("Login realizado com sucesso para:", response.user.name);
      Alert.alert('Sucesso', `Bem-vindo, ${response.user.name}!`);
    } else {
      Alert.alert('Falha no Login', response.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>LearnFlix</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.testData}>
          <Text style={styles.testTitle}>Dados para Teste:</Text>
          <Text style={styles.testText}>Professor: professor@learnflix.com / 123456</Text>
          <Text style={styles.testText}>Aluno: aluno@learnflix.com / 123456</Text>
          <Text style={styles.testText}>Gestor: gestor@learnflix.com / 123456</Text>
          <Text style={styles.testText}>Aluno2: aluno2@learnflix.com / 123456</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0f9', justifyContent: 'center' },
  content: { padding: 20, backgroundColor: '#fff', margin: 20, borderRadius: 10, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6a1b9a', textAlign: 'center', marginBottom: 30 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#6a1b9a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  testData: { marginTop: 30, padding: 15, backgroundColor: '#f3e5f5', borderRadius: 8, borderWidth: 1, borderColor: '#ce93d8', borderStyle: 'dashed' },
  testTitle: { fontWeight: 'bold', color: '#4a148c', marginBottom: 5, textAlign: 'center' },
  testText: { fontSize: 12, color: '#555', marginBottom: 2, fontFamily: 'monospace' },
});