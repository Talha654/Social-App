import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const CommenOptionModal = ({ onClick, onClose, visible }) => {
    // console.log('Options modal props =>>>>>>>>>>>>>.', visible);
    return (
        <Modal onRequestClose={() => onClose()} transparent visible={visible}>
            <View style={{ backgroundColor: 'rgba(0,0,0,.2)', flex: 1 }}>
                <View
                    style={{
                        width: '100%',
                        paddingBottom: 20,
                        backgroundColor: '#fff',
                        bottom: 0,
                        position: 'absolute',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    <Text
                        style={{
                            color: '#000',
                            fontSize: 16,
                            marginTop: 10,
                            marginLeft: 20,
                        }}
                    >
                        Post Options
                    </Text>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            width: '90%',
                            height: 50,
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            onClick(1);
                            // onClose(); // Close the modal after the action
                        }}
                    >
                        <Image
                            source={require('../images/edit.png')}
                            style={{ width: 20, height: 20 }}
                        />
                        <Text style={{ color: '#000', marginLeft: 10 }}>Edit Comment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            width: '90%',
                            height: 50,
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            onClick(2);
                            // onClose(); // Close the modal after the action
                        }}
                    >
                        <Image
                            source={require('../images/delete.png')}
                            style={{ width: 20, height: 20 }}
                        />
                        <Text style={{ color: '#000', marginLeft: 10 }}>Delete Comment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};





export default CommenOptionModal
const styles = StyleSheet.create({})