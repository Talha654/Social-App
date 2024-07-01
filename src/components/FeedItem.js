import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { Colors } from '../utils/Colors';
import { useNavigation } from '@react-navigation/native';


export const timeDifference = (previous) => {

    const currentDate = new Date();

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerMonth * 365;

    // Calculate the difference in milliseconds
    var elapsed = currentDate - previous;

    // // Convert milliseconds to days
    // const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerMonth) + ' years ago';
    }
};

const FeedItem = ({ data, index, list, onClickOptions, onClickLike, onFollow, isFollowed }) => {

    const navigation = useNavigation();
    const authData = useSelector(state => state.auth);

    const checkLiked = () => {
        let isLiked = false;
        data.likes.map(item => {
            if (item == authData.data.data._id) {
                isLiked = true;
            }
        })
        return isLiked;
    };

    return (
        <View style={[styles.feed, { marginBottom: list.length - 1 == index ? 100 : 0 }]}>
            <View style={styles.topView}>
                <View style={styles.topLeft}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('UserProfile', { id: data.userId })
                    }}>
                        <Image source={require('../images/person.png')}
                            style={styles.profile}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.userName}>{data.username}</Text>
                        <Text style={styles.time}>{timeDifference(new Date(data.createdAt))}</Text>
                    </View>
                </View>
                {
                    authData.data.data._id == data.userId &&
                    <TouchableOpacity
                        onPress={() => {
                            onClickOptions();
                        }}
                    >
                        <Image source={require('../images/dot.png')} style={styles.icon} />
                    </TouchableOpacity>
                }
                {
                    authData.data.data._id != data.userId &&
                    <TouchableOpacity style={styles.followeBtn}
                        onPress={() => {
                            onFollow();
                        }}
                    >
                        <Text style={{ color: '#fff' }}>{isFollowed ? 'unfollow' : 'Follow'}</Text>
                    </TouchableOpacity>
                }

            </View>
            <Text style={styles.caption}>{data.caption}</Text>
            {data.imageUrl != '' && <Image source={{ uri: data.imageUrl }} style={styles.image} />}

            <View style={styles.bottomView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        onClickLike();
                    }}>
                        <Image source={checkLiked() ? require('../images/liked.png') : require('../images/like.png')}

                            style={[styles.icon, { tintColor: checkLiked() ? Colors.THEME_COLOR : 'blue' }]} />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{data.likes.length + ' Likes'}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Comments', {
                            id: data._id
                        })
                    }}>
                        <Image source={require('../images/comment.png')} style={{ width: 23, height: 23 }} />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{data.comments.length + ' Comments'}</Text>
                </View>

            </View>

        </View>
    )
}

export default FeedItem

const styles = StyleSheet.create({
    feed: {
        width: '90%',
        paddingBottom: 20,
        alignSelf: 'center',
        backgroundColor: '#f2f2f2',
        marginTop: 20,
        borderRadius: 10
    },
    topView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingRight: 10,
        paddingTop: 10
    },
    topLeft: {
        flexDirection: "row",
        alignItems: 'center'
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        tintColor: '#9e9e9e',
        marginLeft: 10
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    time: {
        fontSize: 10,
        marginTop: 10,
        color: '#000'
    },
    icon: {
        width: 35,
        height: 35
    },
    caption: {
        color: '#000',
        width: '90%',
        alignSelf: 'center',
        marginTop: 10
    },
    image: {
        width: '90%',
        height: 200,
        resizeMode: 'contain',
        marginTop: 10
    },
    bottomView: {
        width: '90%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    likeCount: {
        color: '#000',
        fontSize: 16,
        marginLeft: 10
    },
    followeBtn: {
        backgroundColor: Colors.THEME_COLOR,
        paddingLeft: 15,
        height: 35,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10
    }

})