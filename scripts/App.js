import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar}  from "expo-status-bar";
import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button} from "react-native";
import { BarCodeScanner } from "expo-~-scanner";

export default function APP(){
    const [hasPermission, setHasPermission] = useState(null);
    const [scanner, setScanner] = useState(false);
    const [text, setText] = useState("Not Yet scanned");

    const askForCameraPermission = () => {
        (async() => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status == 'granted')
        })()
    }
    //Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    //What happens when we scan the bar code
    const handleBarCodeScanner = ({type, data}) => {
        setScanner(true);
        setText(data);
        console.log('Type: ' + type + '\nData: ' + data)
    }
    //Check permissions and return the screens
    if(hasPermission == null){
        return(
            <View style = {style.container}>
            <Text>Requesting for Camera Permission</Text>
            </View>
        )
    }
    if(hasPermission == false){
        return(
            <View style = {style.container}>
            <Text style = {{margin: 10}}>no access to camera</Text>
            <Button title = {'Allow Camera'} onPress = {() => askForCameraPermission()}/>
            </View>
        )
    }
    //Return to view
    return(
        <View style = {style.container}>
        <View style = {style.barcodeBox}>
        <BarCodeScanner
        onBarCodeScanned={scanner ? undefined: handleBarCodeScanner}
        style = {{height: 400, width: 400}} />
        </View>
        <Text style = {style.mainText}>{data}</Text>
        {scanner && <Button title = {'Scan again?'} onPress = {() => setScanner(false)} color = 'tomato'/>}
        </View>
    );
}

const style = StyleSheet.created({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    barcodeBox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato'
    },
    mainText: {
        fontSize: 16,
        margin: 20,
    },
});