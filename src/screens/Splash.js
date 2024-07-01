import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const Splash = () => {

    const navigation = useNavigation();
    const authData = useSelector(state => state.auth)
    useEffect(() => {
        console.log(authData);
        setTimeout(() => {
            if (authData.data == null) {
                navigation.navigate('Login');
            } else {
                navigation.navigate('Main');
            }
        }, 3000);
    }, [])

    return (
        <View style={styles.container}>
            <Image source={require("../images/icon.png")} style={styles.logo} />
        </View>
    )
};

export default Splash

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    logo: {
        height: "30%",
        width: "40%",
        resizeMode: "contain"
    }
});