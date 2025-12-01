import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CardAtividade = ({ atividade, perfil, alunoId }) => {
  const navigation = useNavigation();

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Lógica de status migrada da versão web
  let statusTexto = 'Pendente';
  let statusColor = '#ff9800';
  let containerBorderColor = 'transparent';

  if (perfil === 'aluno') {
    const minhaEntrega = atividade.entregas && atividade.entregas[alunoId];
    if (minhaEntrega) {
      statusTexto = minhaEntrega.status;
      if (statusTexto === 'Aguardando Avaliação') statusColor = '#2196f3'; 
      if (statusTexto === 'Aprovado') statusColor = '#4caf50';
      if (statusTexto === 'Reprovado') statusColor = '#f44336'; 
    }
    containerBorderColor = '#6a1b9a'; 
    
  } else if (perfil === 'professor') {
    const todasEntregas = atividade.entregas ? Object.values(atividade.entregas) : [];
    if (todasEntregas.some(e => e.status === 'Aguardando Avaliação')) {
      statusTexto = 'A Avaliar';
      statusColor = '#2196f3';
    } else if (todasEntregas.length > 0 && todasEntregas.every(e => e.status === 'Aprovado' || e.status === 'Reprovado')) {
      statusTexto = 'Corrigido';
      statusColor = '#4caf50';
    }
  }

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: containerBorderColor }]}
      onPress={() => {
        // Navegar para detalhes (vamos criar essa tela na próxima etapa)
        // Por enquanto, apenas logamos
        console.log("Navegar para atividade:", atividade.id);
        // navigation.navigate('DetalhesAtividade', { atividadeId: atividade.id }); 
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{atividade.nome}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{statusTexto}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {atividade.descricao}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.dateLabel}>
          Prazo: <Text style={styles.dateValue}>{formatarData(atividade.dataEntrega)}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a148c',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 12,
    color: '#888',
  },
  dateValue: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CardAtividade;