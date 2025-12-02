import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Image, Modal 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSwipeable } from 'react-swipeable'; 

import { useAuth } from '../contexts/AuthContext';
import { useAtividades } from '../contexts/AtividadeContext';
import { getAllUsers } from '../services/userService';

export default function DetalhesAtividadeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { atividades, entregarAtividade, avaliarEntrega, deleteAtividade } = useAtividades();
  
  // Estados
  const [nota, setNota] = useState('');
  const [feedback, setFeedback] = useState('');
  const [alunoSendoAvaliado, setAlunoSendoAvaliado] = useState(null); 
  const [listaAlunos, setListaAlunos] = useState([]);
  
  // Estado para a foto
  const [fotoEntrega, setFotoEntrega] = useState(null);
  
  // Estado para controlar o Modal de Zoom
  const [modalVisible, setModalVisible] = useState(false);
  const [imagemZoom, setImagemZoom] = useState(null);

  // Obter a atividade
  const { atividadeId } = route.params;
  const atividade = atividades.find(a => a.id === atividadeId);

  // Se não encontrar, volta
  if (!atividade) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Atividade não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- HELPERS ---
  const isProfessor = user.profile === 'Professor';
  const isAluno = user.profile === 'Aluno';

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return `${String(data.getUTCDate()).padStart(2, '0')}/${String(data.getUTCMonth() + 1).padStart(2, '0')}/${data.getUTCFullYear()}`;
  };

  // Carregar lista de alunos (apenas para Professor)
  useEffect(() => {
    if (isProfessor) {
      getAllUsers().then(users => setListaAlunos(users.filter(u => u.profile === 'Aluno')));
    }
  }, []);

  // Ações

  const abrirCamera = () => {
    navigation.navigate('Camera', {
      onPictureTaken: (uri) => {
        setFotoEntrega(uri);
      }
    });
  };

  // Função para abrir o zoom
  const abrirZoom = (uri) => {
    setImagemZoom(uri);
    setModalVisible(true);
  };

  const handleEntregar = () => {
    Alert.alert(
      "Confirmar Entrega",
      "Deseja marcar esta atividade como entregue?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => {
            entregarAtividade(atividade.id, user.id, fotoEntrega);
            Alert.alert("Sucesso", "Atividade entregue!");
          } 
        }
      ]
    );
  };

  const handleDeletar = () => {
    Alert.alert(
      "Deletar Atividade",
      "Tem a certeza? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Deletar", style: "destructive", onPress: () => {
            deleteAtividade(atividade.id);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  const confirmarAvaliacao = () => {
    if (!nota || !feedback) {
      Alert.alert("Erro", "Preencha a nota e o feedback.");
      return;
    }
    avaliarEntrega(atividade.id, alunoSendoAvaliado, nota, feedback);
    setAlunoSendoAvaliado(null);
    setNota('');
    setFeedback('');
    Alert.alert("Sucesso", "Avaliação registada!");
  };

  // --- GESTOS ---
  const handlers = useSwipeable({
    onSwipedRight: () => navigation.goBack(),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  //DADOS DE VISUALIZAÇÃO
  const minhaEntrega = isAluno && atividade.entregas ? atividade.entregas[user.id] : null;
  const statusAluno = minhaEntrega ? minhaEntrega.status : 'Pendente';

  return (
    <SafeAreaView style={styles.container} {...handlers}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{atividade.nome}</Text>
          {isAluno && <Text style={[styles.statusBadge, styles[statusAluno.toLowerCase().replace(/\s/g, '')]]}>{statusAluno}</Text>}
        </View>

        {/* Detalhes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.text}>{atividade.descricao}</Text>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Prazo de Entrega</Text>
          <Text style={styles.text}>{formatarData(atividade.dataEntrega)}</Text>
        </View>

        {/*ÁREA DO ALUNO */}
        {isAluno && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>A Minha Entrega</Text>
            
            {statusAluno === 'Pendente' ? (
              <View>
                {/* Visualização da Foto (Se já tirou)*/}
                {fotoEntrega && (
                  <View style={styles.photoContainer}>
                    <TouchableOpacity onPress={() => abrirZoom(fotoEntrega)}>
                      <Image source={{ uri: fotoEntrega }} style={styles.photoPreview} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFotoEntrega(null)}>
                      <Text style={styles.removePhotoText}>Remover foto</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Botão da Câmera */}
                {!fotoEntrega && (
                  <TouchableOpacity style={styles.cameraButton} onPress={abrirCamera}>
                    <Text style={styles.cameraButtonText}>📷 Tirar Foto do Caderno</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.actionButton} onPress={handleEntregar}>
                  <Text style={styles.actionButtonText}>Entregar Atividade</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.infoText}>Entregue em: {formatarData(minhaEntrega.dataEntregaAluno)}</Text>
                
                {/*Exibe a foto enviada */}
                {minhaEntrega.foto ? (
                  <View style={styles.photoContainer}>
                    <Text style={styles.feedbackTitle}>Anexo Enviado (Toque para ampliar):</Text>
                    <TouchableOpacity onPress={() => abrirZoom(minhaEntrega.foto)}>
                       <Image source={{ uri: minhaEntrega.foto }} style={styles.photoPreview} />
                    </TouchableOpacity>
                  </View>
                ) : (
                   <Text style={{fontSize:12, color:'blue', marginBottom:5}}>Sem anexo</Text>
                )}

                {(statusAluno === 'Aprovado' || statusAluno === 'Reprovado') && (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>Feedback do Professor:</Text>
                    <Text>Nota: {minhaEntrega.nota}</Text>
                    <Text>Comentário: {minhaEntrega.feedback}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/*ÁREA DO PROFESSOR*/}
        {isProfessor && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Entregas dos Alunos</Text>
            
            {listaAlunos.map(aluno => {
              const entrega = atividade.entregas ? atividade.entregas[aluno.id] : null;
              const status = entrega ? entrega.status : 'Pendente';
              const isEditingThis = alunoSendoAvaliado === aluno.id;

              return (
                <View key={aluno.id} style={styles.studentRow}>
                  <View style={styles.studentHeader}>
                    <Text style={styles.studentName}>{aluno.name}</Text>
                    <Text style={[styles.statusSmall, styles[status.toLowerCase().replace(/\s/g, '')]]}>{status}</Text>
                  </View>

                  {/* Professor vê a foto do aluno */}
                  {entrega && entrega.foto && (
                    <View style={styles.studentPhotoContainer}>
                      <Text style={styles.studentPhotoLabel}>Anexo do Aluno:</Text>
                      <TouchableOpacity onPress={() => abrirZoom(entrega.foto)}>
                        <Image source={{ uri: entrega.foto }} style={styles.studentPhotoPreview} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Botão Avaliar */}
                  {status === 'Aguardando Avaliação' && !isEditingThis && (
                    <TouchableOpacity 
                      style={styles.smallButton} 
                      onPress={() => setAlunoSendoAvaliado(aluno.id)}
                    >
                      <Text style={styles.smallButtonText}>Avaliar</Text>
                    </TouchableOpacity>
                  )}

                  {/* Formulário de Avaliação */}
                  {isEditingThis && (
                    <View style={styles.evaluationForm}>
                      <TextInput 
                        style={styles.input} 
                        placeholder="Nota (0-10)" 
                        keyboardType="numeric"
                        value={nota}
                        onChangeText={setNota}
                      />
                      <TextInput 
                        style={styles.input} 
                        placeholder="Feedback" 
                        value={feedback}
                        onChangeText={setFeedback}
                      />
                      <View style={styles.formActions}>
                        <TouchableOpacity onPress={() => setAlunoSendoAvaliado(null)} style={styles.cancelButton}>
                          <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmarAvaliacao} style={styles.confirmButton}>
                          <Text style={styles.confirmText}>Salvar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Resultado */}
                  {(status === 'Aprovado' || status === 'Reprovado') && (
                    <Text style={styles.resultText}>Nota: {entrega.nota}</Text>
                  )}
                </View>
              );
            })}

            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletar}>
              <Text style={styles.deleteText}>Deletar Atividade</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Modal de zoom da foto */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>X Fechar</Text>
          </TouchableOpacity>
          
          {imagemZoom && (
            <Image 
              source={{ uri: imagemZoom }} 
              style={styles.modalImage} 
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0f9' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  backButton: { marginBottom: 10 },
  backText: { color: '#6a1b9a', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#4a148c', marginBottom: 5 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  // Cores de Status
  pendente: { backgroundColor: '#ff9800' },
  aguardandoavaliação: { backgroundColor: '#2196f3' }, 
  aprovado: { backgroundColor: '#4caf50' }, 
  reprovado: { backgroundColor: '#f44336' }, 

  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 20, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#6a1b9a', marginBottom: 10 },
  text: { fontSize: 16, color: '#333', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  
  // Botões Grandes
  actionButton: { backgroundColor: '#6a1b9a', padding: 15, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  deleteButton: { backgroundColor: '#ffebee', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  deleteText: { color: '#d32f2f', fontWeight: 'bold' },

  // Área da Câmera
  cameraButton: {
    backgroundColor: '#e1bee7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ba68c8',
    borderStyle: 'dashed',
  },
  cameraButtonText: { color: '#6a1b9a', fontWeight: 'bold' },
  photoContainer: { alignItems: 'center', marginBottom: 15 },
  photoPreview: { width: 200, height: 200, borderRadius: 8, resizeMode: 'cover', marginBottom: 5 },
  removePhotoText: { color: '#d32f2f', fontSize: 14, textDecorationLine: 'underline', marginTop: 5 },

  // Área de Feedback Aluno
  infoText: { fontSize: 14, color: '#666', marginBottom: 10 },
  feedbackBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#eee' },
  feedbackTitle: { fontWeight: 'bold', marginBottom: 5 },

  // Área Professor
  studentRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  studentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  studentName: { fontSize: 16, fontWeight: '500' },
  statusSmall: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', color: '#fff' },
  
  // Estilos da foto do aluno para o professor
  studentPhotoContainer: { marginBottom: 10, marginTop: 5 },
  studentPhotoLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  studentPhotoPreview: { width: 100, height: 100, borderRadius: 4, resizeMode: 'cover' },

  smallButton: { backgroundColor: '#4caf50', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, alignSelf: 'flex-start' },
  smallButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  resultText: { fontSize: 14, color: '#666', fontStyle: 'italic' },

  // Formulário de Avaliação
  evaluationForm: { marginTop: 10, backgroundColor: '#f5f5f5', padding: 10, borderRadius: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 8, marginBottom: 8 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelButton: { padding: 8 },
  cancelText: { color: '#666' },
  confirmButton: { backgroundColor: '#6a1b9a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 4 },
  confirmText: { color: '#fff', fontWeight: 'bold' },

  // Estilos do modal de zoom
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '95%',
    height: '80%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    zIndex: 1,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});