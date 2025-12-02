import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null); 

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Precisamos da sua permissão para usar a câmera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        setPhoto(photoData); 
      } catch (error) {
        Alert.alert("Erro", "Não foi possível tirar a foto.");
      }
    }
  };

  const confirmPicture = () => {
    if (route.params?.onPictureTaken) {
      route.params.onPictureTaken(photo.uri);
    }
    navigation.goBack();
  };

  const retakePicture = () => {
    setPhoto(null); 
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.button, styles.retakeBtn]} onPress={retakePicture}>
            <Text style={styles.buttonText}>Tirar Outra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmBtn]} onPress={confirmPicture}>
            <Text style={styles.buttonText}>Usar Foto</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="back"
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
        
        {/* Botão Voltar sobreposto */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginBottom: 40,
  },
  captureButton: {
    alignSelf: 'flex-end',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Estilos da Pré-visualização
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#000',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  retakeBtn: {
    backgroundColor: '#d32f2f',
  },
  confirmBtn: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});