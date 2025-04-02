import React, { useState } from 'react';
import { View, Image, Button, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const AiClassifier = () => {
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
  console.log("Starting image analysis");
  
  try {
    console.log("Sending request to server");
    const response = await axios({
      method: 'post',
      url: 'http://192.168.1.11:3000/analyze-image',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        imageBase64: `data:image/jpeg;base64,${base64}`
      },
    });
    
    console.log("Response received:", response.status);
    
    if (response.data && response.data.result) {
      console.log("Setting analysis result");
      setAnalysisResult(
        typeof response.data.result === 'object' 
          ? JSON.stringify(response.data.result, null, 2) 
          : response.data.result
      );
    } else {
      console.log("No result in response");
      setAnalysisResult('No response from AI');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      // More detailed error message
      setAnalysisResult(`Failed to analyze the image: ${error.message}. ${error.response?.data?.error || ''}`);
    } else {
      console.error('Unexpected error:', error);
      setAnalysisResult('Failed to analyze the image due to an unexpected error.');
    }
  } finally {
    setLoading(false);
  }
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

export default AiClassifier;