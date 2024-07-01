import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BASE_URL, DELETE_POST, FOLLOW_USER, Feeds, LIKE_POST, UPDATE_POST, USER_PROFILE } from '../../utils/Strings';
import FeedItem from '../../components/FeedItem';
import { useIsFocused } from '@react-navigation/native';
import OptionModal from '../../components/OptionModal';
import Loader from '../../components/Loader';
import UpdateModal from '../../components/UpdateModal';
import { useSelector } from 'react-redux';

const Feed = () => {
    const [feeds, setFeeds] = useState([]);
    const isFocused = useIsFocused();
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openUpdateModal, setOpenUPdateModal] = useState(false);

    const authData = useSelector(state => state.auth);
    // console.log('init Modal =>>>>>>>>>>>', openModal);

    useEffect(() => {
        getData();
    }, [isFocused]);

    const getData = () => {
        fetch(BASE_URL + Feeds)
            .then(res => res.json())
            .then(json => {
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
                console.log(json);
                getData();
            }).catch(err => {
                // setLoading(false);
                console.log(err);
            })
    };

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getProfileData();
    }, [isFocused]);

    const getProfileData = () => {
        const url = BASE_URL + USER_PROFILE + '/' + authData?.data?.data?._id

        fetch(url).then(res => res.json()).then(json => {
            setUserData(json.data);
            // console.log("Api Data =>>>>>>>>>>>>>", json);
        })
    };

    const followUser = (id) => {
        setLoading(true);
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');
        const body = JSON.stringify({
            userId: authData.data.data._id,
        })
        fetch(BASE_URL + FOLLOW_USER + '/' + id,
            {
                method: 'PUT',
                body,
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                setLoading(false);
                console.log(json);
                getProfileData();
                getData();
            }).catch(err => {
                setLoading(false);
                console.log(err);
            })
    };

    const checkFollow = (id) => {
        let isFollowed = false;
        if (userData) {
            userData.following.map(item => {
                if (item == id) {
                    isFollowed = true;
                }
            })
        }
        return isFollowed;
    };

    return (
        <View style={styles.container}>
            <FlatList data={feeds} renderItem={({ item, index }) => {
                console.log('Feeds Data =>>>>>>>>>>>>>>>', item)
                return (
                    <FeedItem
                        list={feeds}
                        data={item}
                        index={index}
                        isFollowed={checkFollow(item.userId)}
                        onClickOptions={() => {
                            setSelectedItem(item);
                            setOpenModal(true);
                        }}
                        onClickLike={() => {
                            likePost(item);
                        }}
                        onFollow={() => {
                            followUser(item.userId);
                        }}
                    />
                );
            }} />
            {/* <OptionModal
                visible={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                onClick={x => {
                    setOpenModal(false);
                }}
            /> */}

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
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})