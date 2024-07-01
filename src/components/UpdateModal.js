import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../utils/Colors';

const UpdateModal = ({ onClick, onClose, visible, data }) => {
    // console.log('update modal props =>>>>>>>>>>>>>.', visible);
    const [caption, setCaption] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        setCaption(data && data.caption ? data.caption : "");
        setImageUrl(data && data.imageUrl ? data.imageUrl : "");

    }, [visible]);

    return (
        <Modal onRequestClose={() => onClose()} transparent visible={visible}>
            <View style={{ backgroundColor: 'rgba(0,0,0,.2)', flex: 1 }}>
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        paddingBottom: 20,
                        backgroundColor: '#fff',
                        bottom: 0,
                        position: 'absolute',
                    }}
                >
                    <View style={{
                        flexDirection: 'row', width: '100%', paddingLeft: 20,
                        alignItems: 'center', height: 50
                    }}>
                        <TouchableOpacity onPress={() => onClose()}>
                            <Image source={require('../images/cross.png')}
                                style={{ width: 30, height: 30, }} />
                        </TouchableOpacity>
                        <Text style={{
                            marginLeft: 20, fontWeight: '600',
                            color: '#000', fontSize: 20
                        }}>
                            Edit Post</Text>
                    </View>
                    <View style={{
                        width: '90%', alignSelf: 'center',
                        marginTop: 20, padding: 10,
                        borderWidth: 1,
                        height: 100,
                        borderRadius: 10,
                        borderColor: '#9e9e9e'
                    }}>
                        <TextInput
                            placeholder={'Type Caption here....'}
                            placeholderTextColor={'#9e9e9e'}
                            value={caption}
                            onChangeText={(txt) => setCaption(txt)}
                            style={styles.input} />

                    </View>
                    {imageUrl != '' && (<Image source={{ uri: imageUrl }}
                        style={{
                            width: '90%', height: 200,
                            alignSelf: 'center', marginTop: 50,
                            opacity: .5
                        }}
                    />
                    )}
                    <TouchableOpacity style={{
                        width: '90%', height: 50,
                        backgroundColor: Colors.THEME_COLOR,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: 20,
                        borderRadius: 10
                    }}
                        onPress={() => {
                            onClick(caption);
                        }}
                    >
                        <Text style={{ color: '#fff' }}>Update Post</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};





export default UpdateModal
const styles = StyleSheet.create({
    input: {
        width: '100%',
        color: '#000'
    },
})