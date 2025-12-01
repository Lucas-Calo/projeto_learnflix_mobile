import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAtividades } from '../contexts/AtividadeContext';

export default function CriarAtividadeScreen() {
  const navigation = useNavigation();
  const { addAtividade } = useAtividades();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');

  const handleDateChange = (text) => {
    const numbers = text.replace(/\D/g, '');
    let formatted = numbers;
    if (numbers.length > 2) {
      formatted = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }
    if (numbers.length > 4) {
      formatted = `${formatted.slice(0, 5)}/${numbers.slice(4, 8)}`; 
    }

    setDataEntrega(formatted);
  };

  const handleSalvar = () => {
    if (!nome || !descricao || !dataEntrega) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    // Validação básica de formato (DD/MM/AAAA)
    if (dataEntrega.length !== 10) {
       Alert.alert('Erro', 'Data incompleta. Use o formato DD/MM/AAAA');
       return;
    }

    // Converter de DD/MM/AAAA para YYYY-MM-DD (ISO) para salvar no sistema
    const [dia, mes, ano] = dataEntrega.split('/');
    const dataISO = `${ano}-${mes}-${dia}`;
    
    const dataObj = new Date(dataISO);
    
    if (isNaN(dataObj.getTime())) {
       Alert.alert('Erro', 'Data inválida.');
       return;
    }

    addAtividade({
      nome,
      descricao,
      dataEntrega: dataObj.toISOString(),
    });

    Alert.alert('Sucesso', 'Atividade criada!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nova Atividade</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome da Atividade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Trabalho de Física"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva a atividade..."
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Data de Entrega (DD/MM/AAAA)</Text>
          <TextInput
            style={styles.input}
            placeholder="31/12/2025"
            value={dataEntrega}
            onChangeText={handleDateChange} 
            keyboardType="numeric"
            maxLength={10} 
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSalvar}>
            <Text style={styles.submitText}>Salvar Atividade</Text>
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
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 10, shadowOpacity: 0.1, elevation: 3 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  textArea: { height: 100 },
  submitButton: { backgroundColor: '#ff9800', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});