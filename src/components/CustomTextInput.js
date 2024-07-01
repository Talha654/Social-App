import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const CustomTextInput = ({ mt, placeholder,
    onChangeText,
    isValid, value,
    keyboardType,
    icon
}) => {
    return (
        <View style={{
            height: 55, width: "90%",
            borderWidth: 1,
            borderColor: isValid ? "#9e9e9e" : "red",
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: mt ? mt : 20,
            flexDirection: 'row',
            alignItems: "center",
            paddingLeft: 20
        }}>
            {
                icon && <Image source={icon}
                    style={{ width: 24, height: 24 }} />
            }
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={'#9e9e9e'}
                onChangeText={txt => onChangeText(txt)}
                value={value}
                style={{ width: "100%",color:'#000' }}
                keyboardType={keyboardType ? keyboardType : "default"}
            />
        </View>
    )
}

export default CustomTextInput

const styles = StyleSheet.create({})