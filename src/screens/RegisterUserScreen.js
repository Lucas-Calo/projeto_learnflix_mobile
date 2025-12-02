import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/userService';

export default function RegisterUserScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('Aluno');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const userData = { name, email, password, profile };
    
    try {
      const response = await registerUser(userData);
      if (response.success) {
        Alert.alert('Sucesso', 'Usuário criado!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', response.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar usuário.');
    }
  };

  // Componente simples para seleção de perfil (Botões)
  const ProfileOption = ({ title, value }) => (
    <TouchableOpacity 
      style={[styles.optionBtn, profile === value && styles.optionBtnSelected]}
      onPress={() => setProfile(value)}
    >
      <Text style={[styles.optionText, profile === value && styles.optionTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Novo Usuário</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Maria Silva"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha Provisória</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Perfil de Acesso</Text>
          <View style={styles.profileSelector}>
            <ProfileOption title="Aluno" value="Aluno" />
            <ProfileOption title="Professor" value="Professor" />
            <ProfileOption title="Gestor" value="Gestor" />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
            <Text style={styles.submitText}>Cadastrar Usuário</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0f9' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { color: '#6a1b9a', fontSize: 16, marginRight: 15, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4a148c' },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  
  // Seletor de Perfil
  profileSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  optionBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#6a1b9a', borderRadius: 8, marginHorizontal: 4, alignItems: 'center' },
  optionBtnSelected: { backgroundColor: '#6a1b9a' },
  optionText: { color: '#6a1b9a', fontWeight: 'bold' },
  optionTextSelected: { color: '#fff' },

  submitButton: { backgroundColor: '#ff9800', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});