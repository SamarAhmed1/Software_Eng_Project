import React, { useState } from 'react';
import { View, Image, Button, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TakePhotoScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].base64);
    }
  };

  const analyzeImage = async (base64: string) => {
    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('http://192.168.1.9:3000/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: `data:image/jpeg;base64,${base64}` }),
      });

      const data = await response.json();
      if (data.result) {
        setAnalysisResult(data.result);
      } else {
        setAnalysisResult('No response from AI');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisResult('Failed to analyze the image.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Take a Photo" onPress={takePhoto} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {analysisResult && <Text style={styles.resultText}>{analysisResult}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TakePhotoScreen;
