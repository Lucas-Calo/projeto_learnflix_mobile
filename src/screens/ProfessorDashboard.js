import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useAtividades } from '../contexts/AtividadeContext';
import CardAtividade from '../components/CardAtividade';

export default function ProfessorDashboard() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { atividades } = useAtividades();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Painel do Professor</Text>
          <Text style={styles.subtitle}>Olá, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => navigation.navigate('CriarAtividade')}
        >
          <Text style={styles.createButtonText}>+ Criar Atividade</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={atividades}
        extraData={atividades}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CardAtividade 
            atividade={item} 
            perfil="professor"
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Você ainda não criou atividades.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6a1b9a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#6a1b9a',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#6a1b9a',
    fontWeight: 'bold',
  },
  actions: {
    padding: 20,
    paddingBottom: 0,
  },
  createButton: {
    backgroundColor: '#ff9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  }
});