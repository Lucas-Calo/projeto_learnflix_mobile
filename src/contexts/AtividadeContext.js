import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const AtividadeContext = createContext({});

export const AtividadeProvider = ({ children }) => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados em Tempo Real (Listener do Firestore)
  useEffect(() => {
    const q = query(collection(db, "atividades"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listaAtividades = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        listaAtividades.push({ 
          id: doc.id, 
          ...data,
          entregas: data.entregas || {} 
        });
      });
      setAtividades(listaAtividades);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar atividades:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Funções de Negócio

  const addAtividade = async (atividade) => {
    try {
      await addDoc(collection(db, "atividades"), {
        ...atividade,
        entregas: {}
      });
    } catch (e) {
      console.error("Erro ao adicionar atividade:", e);
    }
  };

  const deleteAtividade = async (id) => {
    try {
      await deleteDoc(doc(db, "atividades", id));
    } catch (e) {
      console.error("Erro ao deletar atividade:", e);
    }
  };

  const updateAtividade = async (id, dados) => {
    try {
      const atividadeRef = doc(db, "atividades", id);
      await updateDoc(atividadeRef, dados);
    } catch (e) {
      console.error("Erro ao atualizar atividade:", e);
    }
  };

  const entregarAtividade = async (atividadeId, alunoId, fotoUri = null) => {
    try {
      const atividadeRef = doc(db, "atividades", atividadeId);
      
      const novaEntrega = {
        status: 'Aguardando Avaliação',
        dataEntregaAluno: new Date().toISOString(),
        nota: null,
        feedback: null,
        foto: fotoUri || null
      };

      // Atualiza no Firestore usando dot notation para afetar apenas este aluno
      await updateDoc(atividadeRef, {
        [`entregas.${alunoId}`]: novaEntrega
      });
            
    } catch (e) {
      console.error("Erro ao entregar atividade:", e);
    }
  };

  const avaliarEntrega = async (atividadeId, alunoId, nota, feedback) => {
    try {
      // Busca a atividade atual do estado para pegar dados antigos da entrega se necessário
      const atividade = atividades.find(a => a.id === atividadeId);
      if (!atividade) return;

      const entregaAtual = atividade.entregas ? atividade.entregas[alunoId] : {};
      const notaNum = parseFloat(nota);
      const statusFinal = notaNum >= 6 ? 'Aprovado' : 'Reprovado';

      const entregaAvaliada = {
        ...entregaAtual,
        nota: notaNum,
        feedback: feedback,
        status: statusFinal
      };

      const atividadeRef = doc(db, "atividades", atividadeId);
      
      await updateDoc(atividadeRef, {
        [`entregas.${alunoId}`]: entregaAvaliada
      });

    } catch (e) {
      console.error("Erro ao avaliar entrega:", e);
    }
  };

  return (
    <AtividadeContext.Provider value={{ 
      atividades, 
      addAtividade, 
      deleteAtividade, 
      updateAtividade, 
      entregarAtividade, 
      avaliarEntrega,
      loading 
    }}>
      {children}
    </AtividadeContext.Provider>
  );
};

export const useAtividades = () => useContext(AtividadeContext);