import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BASE_URL, DELETE_POST, Feeds, LIKE_POST, UPDATE_POST, USER_PROFILE } from '../../utils/Strings';
import { useSelector } from 'react-redux';
import { Colors } from '../../utils/Colors';
import FeedItem from '../../components/FeedItem';
import OptionModal from '../../components/OptionModal';
import Loader from '../../components/Loader';
import UpdateModal from '../../components/UpdateModal';

const MyProfile = () => {

    const navigation = useNavigation();

    const isFocused = useIsFocused();
    const authData = useSelector(state => state.auth);
    const [userData, setUserData] = useState(null);
    const [feeds, setFeeds] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openUpdateModal, setOpenUPdateModal] = useState(false);


    useEffect(() => {
        getProfileData();
    }, [isFocused]);

    const getProfileData = () => {
        const url = BASE_URL + USER_PROFILE + '/' + authData?.data?.data?._id

        fetch(url).then(res => res.json()).then(json => {
            setUserData(json.data);
            getPostData(json.data._id);
            // console.log("Api Data =>>>>>>>>>>>>>", json);
        })
    };


    const getPostData = (id) => {
        fetch(BASE_URL + Feeds + '/' + id)
            .then(res => res.json())
            .then(json => {
                // console.log(json)
                json.data.reverse();
                setFeeds(json.data);
            })
    };


    const deletePost = () => {
        setLoading(true);
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');

        fetch(BASE_URL + DELETE_POST + '/' + selectedItem._id,
            {
                method: 'DELETE',
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                setLoading(false);
                console.log(json);
                getData();
            }).catch(err => {
                setLoading(false);
                console.log(err);
            })
    };

    const updatePost = (caption) => {
        setLoading(true);
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');
        const body = JSON.stringify({
            userId: authData.data.data._id,
            caption: caption,
            username: authData.data.data.username
        })
        fetch(BASE_URL + UPDATE_POST + '/' + selectedItem._id,
            {
                method: 'PUT',
                body,
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                setLoading(false);
                console.log(json);
                getData();
            }).catch(err => {
                setLoading(false);
                console.log(err);
            })
    };
    const likePost = (item) => {
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');
        const body = JSON.stringify({
            userId: authData.data.data._id,
        })
        fetch(BASE_URL + LIKE_POST + '/' + item._id,
            {
                method: 'PUT',
                body,
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                // setLoading(false);
                // console.log(json);
                getData();
            }).catch(err => {
                // setLoading(false);
                console.log(err);
            })
    };

    return (
        <ScrollView nestedScrollEnabled style={styles.container}>
            {/* <View style={styles.profileView}>
                <Image source={require('../../images/user-outline.png')}
                    style={styles.profile}
                />
            </View>
            <Text style={styles.userName}>{userData ? userData.username : " "}</Text>
            <Text style={styles.email}>{userData ? userData.emailId : " "}</Text>
            <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnTxt}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={styles.followersView}>
                <View style={styles.countView}>
                    <Text style={styles.values} >{userData ? userData.followers.length : 0}</Text>
                    <Text style={styles.title}>{'Followers'}</Text>
                </View>
                <View style={styles.countView}>
                    <Text style={styles.values} >{userData ? userData.following.length : 0}</Text>
                    <Text style={styles.title}>{'Following'}</Text>
                </View>
                <View style={styles.countView}>
                    <Text style={styles.values} >{0}</Text>
                    <Text style={styles.title}>{'Posts'}</Text>
                </View>
            </View> */}
            <View style={styles.coverArea}>
                {userData != null && userData.coverPic != '' &&
                    < Image source={{ uri: userData.coverPic }}
                        style={{ width: '100%', height: '100%' }} />
                }
            </View>
            <View style={styles.profileView}>
                {userData != null && userData.profilePic != '' ?
                    < Image source={{ uri: userData.profilePic }}
                        style={{ width: 100, height: 100, borderRadius: 50 }} />
                    :
                    <Image source={require('../../images/user-outline.png')}
                        style={styles.profile}
                    />
                }
            </View>
            <Text style={styles.userName}>{userData ? userData.username : " "}</Text>
            <Text style={styles.email}>{userData ? userData.emailId : " "}</Text>

            <View style={styles.followersView}>
                <View style={styles.countView}>
                    <Text style={styles.values} >{userData ? userData.followers.length : 0}</Text>
                    <Text style={styles.title}>{'Followers'}</Text>
                </View>
                <View style={styles.countView}>
                    <Text style={styles.values} >{userData ? userData.following.length : 0}</Text>
                    <Text style={styles.title}>{'Following'}</Text>
                </View>
                <View style={styles.countView}>
                    <Text style={styles.values} >{0}</Text>
                    <Text style={styles.title}>{'Posts'}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => {
                navigation.navigate('EditProfile', { data: userData })
            }} >
                <Text style={styles.editBtnTxt}>Edit Profile</Text>
            </TouchableOpacity>
            <FlatList data={feeds} renderItem={({ item, index }) => {
                return (
                    <FeedItem
                        list={feeds} data={item}
                        index={index}
                        isFollowed={false
                            //  checkFollow(item.userId)
                        }
                        onClickOptions={() => {
                            setSelectedItem(item);
                            setOpenModal(true);
                        }}
                        onClickLike={() => {
                            likePost(item);
                        }}
                        onFollow={() => {
                            //   followUser(item.userId);
                        }}
                    />
                );
            }} />

            <OptionModal
                visible={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                onClick={(x) => {
                    // Handle the click action if needed
                    setOpenModal(false);
                    if (x == 2) {
                        deletePost();
                    } else {
                        setOpenUPdateModal(true);
                    }
                }}
            />
            <Loader visible={loading} />
            <UpdateModal
                data={selectedItem}
                visible={openUpdateModal}
                onClose={() => {
                    setOpenUPdateModal(false);
                }}
                onClick={(x) => {
                    // Handle the click action if needed
                    setOpenUPdateModal(false);
                    updatePost(x);
                }}
            />
        </ScrollView>
    )
}

export default MyProfile

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    profileView: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.THEME_COLOR2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: -50,
    },
    profile: {
        width: 50,
        height: 50,
        tintColor: '#fff'
    },
    userName: {
        fontSize: 25,
        marginLeft: 20,
        marginTop: 10,
        color: '#000',
        fontWeight: '500'
    },
    email: {
        fontSize: 18,
        marginLeft: 20,
        marginTop: 10,
        color: '#000',
        fontWeight: '500'
    },
    editBtn: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        color: '#000',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBtnTxt: {
        color: '#000'
    },
    followersView: {
        width: '90%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20
    },
    countView: {
        alignItems: 'center',

    },
    values: {
        color: '#000',
        fontSize: 25,
        fontWeight: '600'
    },
    title: {
        fontSize: 16,
        color: '#000',
        marginTop: 5
    },
    coverArea: {
        width: '100%',
        height: 150,
        backgroundColor: Colors.THEME_COLOR
    }

});