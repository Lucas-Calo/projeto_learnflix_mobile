import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const CitacaoDoDia = () => {
  const [citacao, setCitacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitacao = async () => {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        const data = await response.json();
        
        setCitacao({ texto: data.quote, autor: data.author });
      } catch (error) {
        console.error("Erro ao buscar citação:", error);
        setCitacao({ 
          texto: "A persistência realiza o impossível.", 
          autor: "Provérbio Chinês" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCitacao();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#6a1b9a" />
        <Text style={styles.loadingText}>A procurar inspiração...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>"{citacao?.texto}"</Text>
      <Text style={styles.authorText}>— {citacao?.autor}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20, 
    marginTop: 20,      
    marginBottom: 10,  
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#ff9800',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loadingText: {
    marginTop: 5,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 12,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 8,
    lineHeight: 20,
  },
  authorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6a1b9a', 
    textAlign: 'right',
  },
});

export default CitacaoDoDia;