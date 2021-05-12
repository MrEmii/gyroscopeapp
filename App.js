import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import {
    gyroscope
} from "react-native-sensors";
export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });


    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            const gyrOn = await Gyroscope.isAvailableAsync();
            console.log(`Giroscopio: ${gyrOn}`);
            setHasPermission(status === 'granted');
        })();

        const subscription = gyroscope.subscribe(({ x, y, z, timestamp }) =>
            console.log({ x, y, z, timestamp }),
            setData({ x, y, z })
        );
        return () => subscription.unsubscribe();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const { x, y, z } = data;

    return (
        <View style={styles.container}>
            <Camera ratio="16:9" style={styles.camera} type={Camera.Constants.Type.back}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.text}>
                        x: {Math.round(x)} y: {Math.round(y)} z: {Math.round(z)}
                    </Text>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});
