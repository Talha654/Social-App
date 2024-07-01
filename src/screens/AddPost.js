import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../utils/Colors';
import storage from '@react-native-firebase/storage';
import { ADD_POST, BASE_URL } from '../utils/Strings';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader';

const AddPost = () => {

    const navigation = useNavigation();

    const ref = useRef();
    const [imageData, setImageData] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const authData = useSelector(state => state.auth)

    const openCamera = async () => {
        const res = await launchCamera({ mediaType: 'photo' })
        if (!res.didCancel) {
            setImageData(res);
        }
    };

    const openGallery = async () => {
        const res = await launchImageLibrary({ mediaType: 'photo' })
        if (!res.didCancel) {
            setImageData(res);
        }
    };

    const uploadImageToFirebase = async () => {
        setLoading(true);
        let url = '';
        const myHeader = new Headers();
        myHeader.append('Content-Type', "application/json");
        if (imageData != null) {
            const reference = storage().ref(imageData.assets[0].fileName);// create ref

            const pathToFile = imageData.assets[0].uri;
            // uploads file
            await reference.putFile(pathToFile);

            url = await storage().ref(imageData.assets[0].fileName).getDownloadURL();
        }
        let body = JSON.stringify({
            "username": authData.data.data.username,
            "userId": authData.data.data._id,
            "caption": caption,
            "imageUrl": url
        });
        fetch(BASE_URL + ADD_POST, {
            body,
            method: 'post',
            headers: myHeader
        }).then(res => res.json()).then(json => {
            setLoading(false);
            console.log("Post Created Successfully=>>>>>>>>>>>>>", json);
            navigation.goBack();
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.captionBox}
                onPress={() => {
                    ref.current.focus();
                }}
            >
                <TextInput ref={ref} placeholder={'Type Caption here....'}
                    placeholderTextColor={'#9e9e9e'}
                    value={caption}
                    onChangeText={(txt) => setCaption(txt)}
                    style={styles.input} />
            </TouchableOpacity>

            {imageData != null && <View style={styles.selectedImageView}>
                <Image source={{ uri: imageData.assets[0].uri }}
                    style={styles.selectedImage}
                    resizeMode='cover'
                />
                <TouchableOpacity style={styles.removeBtn}
                    onPress={() => {
                        setImageData(null);
                    }}
                >
                    <Image source={require('../images/cross.png')}
                        style={[styles.icon, { tintColor: '#000', width: 20, height: 20 }]}
                    />
                </TouchableOpacity>
            </View>}

            <TouchableOpacity style={[styles.pickerBtn, { marginTop: 50 }]}
                onPress={() => {
                    openCamera();
                }}
            >
                <Image source={require('../images/camera.png')} style={styles.icon} />
                <Text style={styles.pickerTitle}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pickerBtn, { marginTop: 20 }]}
                onPress={() => {
                    openGallery();
                }}
            >
                <Image source={require('../images/gallery.png')} style={styles.icon} />
                <Text style={styles.pickerTitle}>Open Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
                disabled={caption == '' && imageData == null ? true : false}
                style={[styles.postBtn,
                { backgroundColor: caption == '' && imageData == null ? '#f2f2f2' : Colors.THEME_COLOR }]}
                onPress={() => {
                    uploadImageToFirebase();
                }}
            >
                <Text style={styles.btnTxt}>Post Now</Text>
            </TouchableOpacity>
            < Loader visible={loading} />
        </View>
    )
}

export default AddPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    captionBox: {
        width: '95%',
        height: 130,
        borderWidth: .4,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10,
        borderColor: '#9e9e9e',
        padding: 10
    },
    input: {
        width: '100%',
        color: '#000'
    },
    pickerBtn: {
        width: '90%',
        height: 50,
        flexDirection: 'row',
        alignSelf: 'center',
        borderBottomWidth: .4,
        borderBottomColor: '#9e9e9e',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: '#9e9e9e'
    },
    pickerTitle: {
        color: '#000',
        marginLeft: 15,
        fontSize: 18
    },
    selectedImageView: {
        width: '90%',
        height: 200,
        marginTop: 20,
        borderRadius: 10,
        alignSelf: 'center'
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    removeBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        right: 10
    },
    postBtn: {
        width: '90%',
        height: 50,
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    btnTxt: {
        fontSize: 16,
        color: '#fff'
    },

});