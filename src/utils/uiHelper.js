import { Platform } from 'react-native';

/**
 * Gera estilos de sombra compatíveis com iOS e Android.
 * @param {number} elevation - O nível de elevação (profundidade) desejado.
 */
export const getShadow = (elevation = 5) => {
  if (Platform.OS === 'android') {
    return { 
      elevation 
    };
  } else {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation * 0.5 },
      shadowOpacity: 0.2 + (elevation * 0.01),
      shadowRadius: elevation * 0.8,
    };
  }
};