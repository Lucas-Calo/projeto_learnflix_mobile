import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useAtividades } from '../contexts/AtividadeContext';
import CardAtividade from '../components/CardAtividade';

export default function AlunoDashboardScreen() {
  const { user, logout } = useAuth();
  const { atividades } = useAtividades();
  // ordernar atividades:
  const atividadesOrdenadas = [...atividades].sort((a, b) => 
  new Date(a.dataEntrega) - new Date(b.dataEntrega)
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Minhas Atividades</Text>
          <Text style={styles.subtitle}>Olá, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Atividades */}
      <FlatList
        data={atividadesOrdenadas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CardAtividade 
            atividade={item} 
            perfil="aluno" 
            alunoId={user.id} 
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma atividade pendente. Parabéns!</Text>
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
    backgroundColor: '#fff',
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