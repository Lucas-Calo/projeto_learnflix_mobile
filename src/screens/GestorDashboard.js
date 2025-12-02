import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { useAtividades } from '../contexts/AtividadeContext';
import { getAllUsers, deleteUser } from '../services/userService';

export default function GestorDashboardScreen() {
  const { user, logout } = useAuth();
  const { atividades } = useAtividades();
  const navigation = useNavigation();

  const [usersList, setUsersList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ alunos: 0, profs: 0, atividades: 0 });

  const loadData = async () => {
    setRefreshing(true);
    try {
      const users = await getAllUsers();
      setUsersList(users);
      
      const totalAlunos = users.filter(u => u.profile === 'Aluno').length;
      const totalProfs = users.filter(u => u.profile === 'Professor').length;
      
      setStats({
        alunos: totalAlunos,
        profs: totalProfs,
        atividades: atividades.length
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [atividades])
  );

  const handleDeleteUser = (userId, userName) => {
    if (userId === user.uid) {
      Alert.alert("Ação Bloqueada", "Você não pode deletar a sua própria conta de administrador.");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Tem a certeza que deseja remover o usuário ${userName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          style: "destructive",
          onPress: async () => {
            const response = await deleteUser(userId);
            if (response.success) {
              Alert.alert("Sucesso", "Usuário removido.");
              loadData(); 
            } else {
              Alert.alert("Erro", "Não foi possível deletar.");
            }
          }
        }
      ]
    );
  };

  // Helper para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    try {
      const data = new Date(dataString);
      return `${String(data.getUTCDate()).padStart(2, '0')}/${String(data.getUTCMonth() + 1).padStart(2, '0')}`;
    } catch (e) { return 'Data Inválida'; }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Painel do Gestor</Text>
          <Text style={styles.subtitle}>Admin: {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
      >
        {/* ESTATÍSTICAS */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.alunos}</Text>
            <Text style={styles.statLabel}>Alunos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.profs}</Text>
            <Text style={styles.statLabel}>Profs</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#ff9800' }]}>
            <Text style={styles.statNumber}>{stats.atividades}</Text>
            <Text style={styles.statLabel}>Ativ.</Text>
          </View>
        </View>

        {/* AÇÕES */}
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => navigation.navigate('RegisterUser')}
        >
          <Text style={styles.createButtonText}>+ Cadastrar Novo Usuário</Text>
        </TouchableOpacity>

        {/* LISTA DE USUÁRIOS */}
        <Text style={styles.sectionTitle}>Usuários Cadastrados</Text>
        {usersList.map((u) => (
          <View key={u.id} style={styles.userRow}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={styles.userEmail}>{u.email}</Text>
            </View>
            <View style={styles.userActions}>
              <Text style={[styles.badge, styles[u.profile ? u.profile.toLowerCase() : 'aluno']]}>
                {u.profile}
              </Text>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(u.id, u.name)}>
                <Text style={styles.deleteBtnText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Todas as Atividades</Text>
        
        {/* Cabeçalho da "Tabela" */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Nome</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Prazo</Text>
          <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Entregas</Text>
        </View>

        {atividades.map((atividade) => (
          <TouchableOpacity 
            key={atividade.id} 
            style={styles.atividadeRow}
            onPress={() => navigation.navigate('DetalhesAtividade', { atividadeId: atividade.id })}
          >
            <Text style={[styles.cellText, { flex: 2, fontWeight: 'bold', color: '#6a1b9a' }]} numberOfLines={1}>
              {atividade.nome}
            </Text>
            <Text style={[styles.cellText, { flex: 1 }]}>
              {formatarData(atividade.dataEntrega)}
            </Text>
            <Text style={[styles.cellText, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>
              {atividade.entregas ? Object.keys(atividade.entregas).length : 0}
            </Text>
          </TouchableOpacity>
        ))}

        {atividades.length === 0 && (
          <Text style={{textAlign: 'center', color: '#999', marginTop: 10}}>Nenhuma atividade criada.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0f9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6a1b9a' },
  subtitle: { fontSize: 14, color: '#666' },
  logoutButton: { borderWidth: 1, borderColor: '#6a1b9a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  logoutText: { color: '#6a1b9a', fontWeight: 'bold' },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 4, borderLeftWidth: 4, borderLeftColor: '#6a1b9a', elevation: 2, shadowOpacity: 0.1, shadowRadius: 3 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#666' },

  createButton: { backgroundColor: '#6a1b9a', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 25, elevation: 3 },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4a148c', marginBottom: 10 },
  
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '500', color: '#333' },
  userEmail: { fontSize: 12, color: '#888' },
  userActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  
  badge: { fontSize: 10, fontWeight: 'bold', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  aluno: { backgroundColor: '#6a1b9a' },
  professor: { backgroundColor: '#2196f3' }, 
  gestor: { backgroundColor: '#ff9800' },

  deleteBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffebee', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  deleteBtnText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14 },

  tableHeader: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: '#e0e0e0', marginBottom: 5 },
  headerCell: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  atividadeRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff', paddingHorizontal: 10, marginBottom: 5, borderRadius: 6 },
  cellText: { fontSize: 14, color: '#333' },
});