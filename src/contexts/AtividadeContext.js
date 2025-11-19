import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AtividadeContext = createContext({});

export const AtividadeProvider = ({ children }) => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('atividades');
        if (dadosSalvos) setAtividades(JSON.parse(dadosSalvos));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem('atividades', JSON.stringify(atividades));
        } catch (e) {
          console.error(e);
        }
      };
      saveData();
    }
  }, [atividades, loading]);

  const addAtividade = (atividade) => {
    setAtividades(prev => [...prev, { ...atividade, id: Date.now(), entregas: {} }]);
  };

  const deleteAtividade = (id) => {
    setAtividades(prev => prev.filter(a => a.id !== id));
  };

  const updateAtividade = (id, dados) => {
    setAtividades(prev => prev.map(a => a.id === id ? { ...a, ...dados } : a));
  };

  const entregarAtividade = (atividadeId, alunoId) => {
    setAtividades(prev => prev.map(atividade => {
      if (atividade.id === atividadeId) {
        const novaEntrega = {
          status: 'Aguardando Avaliação',
          dataEntregaAluno: new Date().toISOString(),
          nota: null,
          feedback: null
        };
        return { ...atividade, entregas: { ...atividade.entregas, [alunoId]: novaEntrega } };
      }
      return atividade;
    }));
  };

  const avaliarEntrega = (atividadeId, alunoId, nota, feedback) => {
    const notaNum = parseFloat(nota);
    const statusFinal = notaNum >= 6 ? 'Aprovado' : 'Reprovado';
    
    setAtividades(prev => prev.map(atividade => {
      if (atividade.id === atividadeId) {
        const entregaAtual = atividade.entregas[alunoId];
        if (!entregaAtual) return atividade;
        const entregaAvaliada = {
          ...entregaAtual,
          nota: notaNum,
          feedback: feedback,
          status: statusFinal
        };
        return { ...atividade, entregas: { ...atividade.entregas, [alunoId]: entregaAvaliada } };
      }
      return atividade;
    }));
  };

  return (
    <AtividadeContext.Provider value={{ 
      atividades, addAtividade, deleteAtividade, updateAtividade, entregarAtividade, avaliarEntrega, loading 
    }}>
      {children}
    </AtividadeContext.Provider>
  );
};

export const useAtividades = () => useContext(AtividadeContext);