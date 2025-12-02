import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Image, Modal 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSwipeable } from 'react-swipeable'; 
import * as DocumentPicker from 'expo-document-picker';

import { useAuth } from '../contexts/AuthContext';
import { useAtividades } from '../contexts/AtividadeContext';
import { getAllUsers } from '../services/userService';

export default function DetalhesAtividadeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { atividades, entregarAtividade, avaliarEntrega, deleteAtividade } = useAtividades();
  
  const [nota, setNota] = useState('');
  const [feedback, setFeedback] = useState('');
  const [alunoSendoAvaliado, setAlunoSendoAvaliado] = useState(null); 
  const [listaAlunos, setListaAlunos] = useState([]);
  
  const [fotoEntrega, setFotoEntrega] = useState(null);
  const [docEntrega, setDocEntrega] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [imagemZoom, setImagemZoom] = useState(null);

  const { atividadeId } = route.params;
  const atividade = atividades.find(a => a.id === atividadeId);

  if (!atividade) {
    return (
      <SafeAreaView style={styles.container}><Text>Não encontrada.</Text></SafeAreaView>
    );
  }

  const isProfessor = user.profile === 'Professor';
  const isAluno = user.profile === 'Aluno';

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return `${String(data.getUTCDate()).padStart(2, '0')}/${String(data.getUTCMonth() + 1).padStart(2, '0')}/${data.getUTCFullYear()}`;
  };

  useEffect(() => {
    if (isProfessor) {
      getAllUsers().then(users => setListaAlunos(users.filter(u => u.profile === 'Aluno')));
    }
  }, []);

  //AÇÕES

  const abrirCamera = () => {
    navigation.navigate('Camera', {
      onPictureTaken: (uri) => setFotoEntrega(uri)
    });
  };

  // Função para selecionar PDF
  const selecionarDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Filtra apenas PDFs
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        // Guarda o objeto do arquivo (nome, uri, etc)
        setDocEntrega(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  };

  const abrirZoom = (uri) => {
    setImagemZoom(uri);
    setModalVisible(true);
  };

  const handleEntregar = () => {
    Alert.alert(
      "Confirmar Entrega",
      "Deseja enviar a atividade?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => {
            // Passa a foto E o documento
            entregarAtividade(atividade.id, user.id, fotoEntrega, docEntrega);
            Alert.alert("Sucesso", "Atividade entregue!");
          } 
        }
      ]
    );
  };

  const handleDeletar = () => {
    Alert.alert(
      "Deletar", "Tem a certeza?",
      [{ text: "Cancelar" }, { text: "Deletar", style: "destructive", onPress: () => { deleteAtividade(atividade.id); navigation.goBack(); } }]
    );
  };

  const confirmarAvaliacao = () => {
    if (!nota || !feedback) return Alert.alert("Erro", "Preencha tudo.");
    avaliarEntrega(atividade.id, alunoSendoAvaliado, nota, feedback);
    setAlunoSendoAvaliado(null);
    setNota(''); setFeedback('');
  };

  const handlers = useSwipeable({
    onSwipedRight: () => navigation.goBack(),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const entregas = atividade.entregas || {};
  const minhaEntrega = isAluno ? entregas[user.id] : null;
  const statusAluno = minhaEntrega ? minhaEntrega.status : 'Pendente';

  return (
    <SafeAreaView style={styles.container} {...handlers}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{atividade.nome}</Text>
          {isAluno && <Text style={[styles.statusBadge, styles[statusAluno.toLowerCase().replace(/\s/g, '')]]}>{statusAluno}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.text}>{atividade.descricao}</Text>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Prazo</Text>
          <Text style={styles.text}>{formatarData(atividade.dataEntrega)}</Text>
        </View>

        {/*ÁREA DO ALUNO*/}
        {isAluno && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>A Minha Entrega</Text>
            
            {statusAluno === 'Pendente' ? (
              <View>
                {/* Visualização da FOTO */}
                {fotoEntrega ? (
                  <View style={styles.attachContainer}>
                    <TouchableOpacity onPress={() => abrirZoom(fotoEntrega)}>
                      <Image source={{ uri: fotoEntrega }} style={styles.photoThumb} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFotoEntrega(null)}>
                      <Text style={styles.removeText}>Remover Foto</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.attachButton} onPress={abrirCamera}>
                    <Text style={styles.attachText}>📷 Tirar Foto</Text>
                  </TouchableOpacity>
                )}

                {/* Visualização do PDF */}
                {docEntrega ? (
                  <View style={styles.attachContainer}>
                    <View style={styles.fileThumb}>
                      <Text style={styles.fileIcon}>📄</Text>
                      <Text style={styles.fileName} numberOfLines={1}>{docEntrega.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setDocEntrega(null)}>
                      <Text style={styles.removeText}>Remover PDF</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.attachButton, {marginTop: 10}]} onPress={selecionarDocumento}>
                    <Text style={styles.attachText}>📎 Anexar PDF</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={[styles.actionButton, {marginTop: 20}]} onPress={handleEntregar}>
                  <Text style={styles.actionButtonText}>Entregar Atividade</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.infoText}>Entregue em: {formatarData(minhaEntrega.dataEntregaAluno)}</Text>
                
                {/* FOTO ENVIADA */}
                {minhaEntrega.foto && (
                  <View style={styles.resultAttach}>
                     <Text style={styles.label}>Foto:</Text>
                     <TouchableOpacity onPress={() => abrirZoom(minhaEntrega.foto)}>
                       <Image source={{ uri: minhaEntrega.foto }} style={styles.photoThumb} />
                     </TouchableOpacity>
                  </View>
                )}

                {/* PDF ENVIADO */}
                {minhaEntrega.documento && (
                   <View style={styles.resultAttach}>
                      <Text style={styles.label}>Documento:</Text>
                      <View style={styles.fileRow}>
                        <Text>📄 {minhaEntrega.documento.name}</Text>
                      </View>
                   </View>
                )}

                {(statusAluno === 'Aprovado' || statusAluno === 'Reprovado') && (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>Feedback:</Text>
                    <Text>Nota: {minhaEntrega.nota}</Text>
                    <Text>{minhaEntrega.feedback}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/*  ÁREA DO PROFESSOR */}
        {isProfessor && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Entregas dos Alunos</Text>
            {listaAlunos.map(aluno => {
              const entrega = atividade.entregas ? atividade.entregas[aluno.id] : null;
              const status = entrega ? entrega.status : 'Pendente';
              const isEditing = alunoSendoAvaliado === aluno.id;

              return (
                <View key={aluno.id} style={styles.studentRow}>
                  <View style={styles.studentHeader}>
                    <Text style={styles.studentName}>{aluno.name}</Text>
                    <Text style={[styles.statusSmall, styles[status.toLowerCase().replace(/\s/g, '')]]}>{status}</Text>
                  </View>

                  {/* Anexos do Aluno para o Professor */}
                  {entrega && (
                    <View style={{marginTop: 5}}>
                      {entrega.foto && (
                         <TouchableOpacity onPress={() => abrirZoom(entrega.foto)}>
                           <Text style={{color:'#2196f3', fontSize:12}}>📷 Ver Foto</Text>
                         </TouchableOpacity>
                      )}
                      {entrega.documento && (
                         <Text style={{color:'#666', fontSize:12}}>📄 {entrega.documento.name}</Text>
                      )}
                    </View>
                  )}

                  {status === 'Aguardando Avaliação' && !isEditing && (
                    <TouchableOpacity style={styles.smallButton} onPress={() => setAlunoSendoAvaliado(aluno.id)}>
                      <Text style={styles.smallButtonText}>Avaliar</Text>
                    </TouchableOpacity>
                  )}

                  {isEditing && (
                    <View style={styles.evaluationForm}>
                      <TextInput style={styles.input} placeholder="Nota" value={nota} onChangeText={setNota} keyboardType="numeric"/>
                      <TextInput style={styles.input} placeholder="Feedback" value={feedback} onChangeText={setFeedback}/>
                      <View style={styles.formActions}>
                        <TouchableOpacity onPress={() => setAlunoSendoAvaliado(null)}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                        <TouchableOpacity onPress={confirmarAvaliacao} style={styles.confirmButton}><Text style={styles.confirmText}>Salvar</Text></TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletar}><Text style={styles.deleteText}>Deletar Atividade</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}><Text style={styles.modalCloseText}>X</Text></TouchableOpacity>
          {imagemZoom && <Image source={{ uri: imagemZoom }} style={styles.modalImage} resizeMode="contain" />}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0f9' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  backText: { color: '#6a1b9a', fontWeight: 'bold' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#4a148c' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', color: '#fff', fontWeight: 'bold', fontSize: 12, alignSelf: 'flex-start' },
  pendente: { backgroundColor: '#ff9800' },
  aguardandoavaliação: { backgroundColor: '#2196f3' },
  aprovado: { backgroundColor: '#4caf50' },
  reprovado: { backgroundColor: '#f44336' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 20, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#6a1b9a', marginBottom: 10 },
  text: { fontSize: 16, color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  
  // Attachments
  attachButton: { backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed' },
  attachText: { color: '#333', fontWeight: '500' },
  attachContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginBottom: 10 },
  photoThumb: { width: 50, height: 50, borderRadius: 4 },
  fileThumb: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  fileIcon: { fontSize: 24, marginRight: 10 },
  fileName: { fontSize: 14, color: '#333', flex: 1 },
  removeText: { color: '#d32f2f', fontSize: 12, fontWeight: 'bold' },
  resultAttach: { marginBottom: 10 },
  label: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  fileRow: { backgroundColor: '#f9f9f9', padding: 8, borderRadius: 4, marginTop: 2 },

  actionButton: { backgroundColor: '#6a1b9a', padding: 15, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#ffebee', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  deleteText: { color: '#d32f2f', fontWeight: 'bold' },
  
  infoText: { fontSize: 14, color: '#666', marginBottom: 10 },
  feedbackBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#eee' },
  feedbackTitle: { fontWeight: 'bold', marginBottom: 5 },
  
  studentRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  studentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentName: { fontSize: 16, fontWeight: '500' },
  statusSmall: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', color: '#fff' },
  smallButton: { backgroundColor: '#4caf50', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, alignSelf: 'flex-end', marginTop: 5 },
  smallButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  resultText: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  
  evaluationForm: { marginTop: 10, backgroundColor: '#f5f5f5', padding: 10, borderRadius: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 8, marginBottom: 8 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelButton: { padding: 8 },
  cancelText: { color: '#666' },
  confirmButton: { backgroundColor: '#6a1b9a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 4 },
  confirmText: { color: '#fff', fontWeight: 'bold' },

  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '95%', height: '80%' },
  modalCloseButton: { position: 'absolute', top: 50, right: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5 },
  modalCloseText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});