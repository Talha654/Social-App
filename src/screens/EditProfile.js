import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../utils/Colors'
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { BASE_URL, UPDATE_USER } from '../utils/Strings';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomTextInput from '../components/CustomTextInput';

const EditProfile = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const [cover, setCover] = useState(route.params.data.coverPic == '' ? '' : route.params.data.coverPic);
    const [profile, setProfile] = useState(route.params.data.profilePic == '' ? '' : route.params.data.profilePic);
    const [imageData, setImageData] = useState(null);
    const [isCoverEdit, setIsCoverEdit] = useState(false);
    const [isProdileEdit, setIsProfileEdit] = useState(false);
    const [userName, setUserName] = useState(route.params.data.username == '' ? '' : route.params.data.username);
    const [badUserName, setBadUserName] = useState('');
    const [mobile, setMobile] = useState(route.params.data.mobile == '' ? '' : route.params.data.mobile);
    // const [badMobile, setBadMobile] = useState('');
    // const [bio, setBio] = useState('');
    const [address, setAddress] = useState('');
    const authData = useSelector(state => state.auth);

    // console.log('Params Data=>>>>>>>>>>>>>>>>>>>>>>.', route.params.data)

    const openGallery = async (type) => {
        const res = await launchImageLibrary({ mediaType: 'photo' });
        console.log('Image Upload=>>>>>>>>')
        if (!res.didCancel) {
            if (type == 'cover') {
                setCover(res.assets[0].uri);
                setIsCoverEdit(true);
                setIsProfileEdit(false);
                console.log("Cover Img =>>>>>>>>>>>>")
            } else {
                console.log("profile Img =>>>>>>>>>>>>")
                setProfile(res.assets[0].uri);
                setIsProfileEdit(true);
                setIsCoverEdit(false);
            }
            setImageData(res);
        }
    };

    const uploadimage = async () => {
        if (imageData != null) {
            const reference = storage().ref(imageData.assets[0].fileName);// create ref

            const pathToFile = imageData.assets[0].uri;
            // uploads file
            await reference.putFile(pathToFile);

            url = await storage().ref(imageData.assets[0].fileName).getDownloadURL();
        }
        if (isProdileEdit) {
            updateProfilePic(url);
        } else {
            updateCoverPic(url);
            console.log('Cover Pic=>>>>>>>>>>>>>>>>>>>>>>>')
        }
    };

    const updateProfilePic = (url) => {
        const myHeader = new Headers();
        myHeader.append('Content-Type', "application/json");

        let body = JSON.stringify({
            "profilePic": url
        });
        fetch(BASE_URL + UPDATE_USER + '/' + authData.data.data._id, {
            method: 'PUT',
            body: body,
            headers: myHeader
        }).then(res => res.json()).then(json => {
            console.log('Profile pic Updated=>>>>>>>>>>', json)
            setImageData(null);
            setCover("");
            setIsProfileEdit(false);
            setIsCoverEdit(false);
            navigation.goBack();

        }).catch(err => console.log(err))

    };

    const updateCoverPic = (url) => {
        const myHeader = new Headers();
        myHeader.append('Content-Type', "application/json");

        let body = JSON.stringify({
            "coverPic": url
        });
        fetch(BASE_URL + UPDATE_USER + '/' + authData.data.data._id, {
            method: 'PUT',
            body: body,
            headers: myHeader
        }).then(res => res.json()).then(json => {
            console.log('Cover pic Updated=>>>>>>>>>>', json)
            setImageData(null);
            setCover("");
            setIsProfileEdit(false);
            setIsCoverEdit(false);
            navigation.goBack();
        }).catch(err => console.log(err))
    };

    const updateChanges = () => {
        const myHeader = new Headers();
        myHeader.append('Content-Type', "application/json");

        let body = JSON.stringify({
            username: userName,
            mobile: mobile
        });
        fetch(BASE_URL + UPDATE_USER + '/' + authData.data.data._id, {
            method: 'PUT',
            body: body,
            headers: myHeader
        }).then(res => res.json()).then(json => {
            console.log('Changes Update =>>>>>>>>>>', JSON.stringify(json));

            navigation.goBack();

        }).catch(err => console.log(err))

    };

    return (
        <ScrollView>
            <Text style={styles.heading}>Change Cover Pic</Text>
            <TouchableOpacity style={styles.coverBtn} onPress={() => {
                openGallery('cover');
                // console.log('Cover img =>>>>>>>>>>>>>>>>>.', cover)
            }}>
                {cover != '' ? <Image source={{ uri: cover }} style={styles.coverStyle} />
                    : <Image source={require('../images/gallery.png')} style={styles.img} />
                }
                <Image source={require('../images/edit.png')} style={styles.edit} />
            </TouchableOpacity>

            {isCoverEdit && <TouchableOpacity style={styles.updateBtn}
                onPress={() => {
                    uploadimage();
                }}>
                <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>}

            <Text style={styles.heading}>Change Profile Pic</Text>


            <TouchableOpacity style={styles.profileBtn}
                onPress={() => {
                    openGallery('profile')
                }}>
                {profile != '' ? <Image source={{ uri: profile }} style={[styles.profileBtn, {
                    backgroundColor: 'transparent',
                    padding: 0,
                    marginLeft: 0,
                    marginTop: 0
                }]} />
                    : <Image source={require('../images/gallery.png')}
                        style={[styles.img, { height: 30, width: 30 }]} />
                }

                <Image source={require('../images/edit.png')}
                    style={[styles.edit, { right: 20, height: 15, width: 15 }]} />
            </TouchableOpacity>

            {isProdileEdit && <TouchableOpacity style={styles.updateBtn}
                onPress={() => {
                    uploadimage();
                }}>
                <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>}

            <Text style={styles.heading}>Edit Other Details</Text>
            <CustomTextInput
                placeholder={"Enter UserName"}
                value={userName}
                onChangeText={setUserName}
                isValid={badUserName == '' ? true : false}
            />
            <CustomTextInput
                placeholder={"Enter mobile"}
                value={mobile}
                onChangeText={setMobile}
                isValid={true}
            />
            {/* <CustomTextInput
                placeholder={"Enter Bio"}
                value={bio}
                onChangeText={setBio}
                isValid={true}
            />
            <CustomTextInput
                placeholder={"Enter Address"}
                value={address}
                onChangeText={setAddress}
                isValid={true}
            /> */}
            <TouchableOpacity style={styles.UpdateDataBtn} onPress={() => { updateChanges() }}>
                <Text style={styles.btnText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    heading: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500',
        marginLeft: 20,
        marginTop: 20
    },
    coverBtn: {
        width: '90%',
        height: 120,
        backgroundColor: Colors.THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 10
    },
    img: {
        height: 50,
        width: 50,
        tintColor: '#fff'
    },
    edit: {
        width: 20,
        height: 20,
        position: 'absolute',
        top: 10,
        right: 10,
        tintColor: '#9e9e9e'
    },
    coverStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10
    },
    updateBtn: {
        width: 120,
        height: 60,
        backgroundColor: Colors.THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 20,
        borderRadius: 10
    },
    btnText: {
        color: '#fff'
    },
    profileBtn: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.THEME_COLOR,
        marginLeft: 20,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    UpdateDataBtn: {
        width: '90%',
        height: 50,
        marginTop: 20,
        marginBottom: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: Colors.THEME_COLOR
    },
    btnText: {

    }
})