import { Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../utils/Colors'
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { ADD_COMMENT, BASE_URL, DELETE_COMMENTS, GET_COMMENTS, UPDATE_COMMENT } from '../utils/Strings';
import { FlatList } from 'react-native-gesture-handler';
import CommentItem from '../components/CommentItem';
import CommenOptionModal from '../components/CommentOptionModal';

const Comments = () => {

    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [openCommentOption, setOpenCommentOption] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openUpdateCommentModal, setOpenUpdateCommentModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const authData = useSelector(state => state.auth);
    const route = useRoute();

    const postComment = () => {
        setLoading(true);
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');
        const body = JSON.stringify({
            userId: authData.data.data._id,
            comment: comment,
            username: authData.data.data.username,
            postId: route.params.id
        })
        fetch(BASE_URL + ADD_COMMENT,
            {
                method: 'POST',
                body,
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                setLoading(false);
                setComment('');
                Keyboard.dismiss();

                getAllComments();
                console.log(json);
            }).catch(err => {
                setLoading(false);
                setComment('');
                console.log(err);
            })
    };

    useEffect(() => {
        getAllComments();
    }, [])

    const getAllComments = () => {
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');
        fetch(BASE_URL + GET_COMMENTS + '/' + route.params.id,
            {
                method: 'get',
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                // setLoading(false);
                setCommentList(json.data);
                console.log(json);
            }).catch(err => {
                // setLoading(false);
                // setComment('');
                console.log(err);
            })
    };
    const deleteComment = () => {
        setLoading(true);
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');

        fetch(BASE_URL + DELETE_COMMENTS + '/' + selectedItem._id,
            {
                method: 'DELETE',
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                setLoading(false);
                console.log(json);
                getAllComments();
            }).catch(err => {
                setLoading(false);
                console.log(err);
            })
    };
    const updateComment = () => {
        setLoading(true);
        const myHeader = new Headers();
        myHeader.append('Content-type', 'application/json');
        const body = JSON.stringify({
            userId: authData.data.data._id,
            comment: newComment,
            username: authData.data.data.username,
            postId: route.params.id
        })
        fetch(BASE_URL + UPDATE_COMMENT + '/' + selectedItem._id,
            {
                method: 'PUT',
                body,
                headers: myHeader
            })
            .then(res => res.json())
            .then(json => {
                setLoading(false);
                console.log(json);
                getAllComments();
            }).catch(err => {
                setLoading(false);
                console.log(err);
            })
    };

    return (
        <View style={styles.container}>

            <FlatList
                data={commentList}
                renderItem={({ item, index }) => {
                    return (
                        <CommentItem data={item}
                            onClickOption={() => {
                                setSelectedItem(item);
                                setOpenCommentOption(true);

                            }}
                        />
                    )
                }}
            />

            <View style={styles.bottomView}>
                <TextInput placeholder='Type comment here...'
                    placeholderTextColor={'#9e9e9e'}
                    value={comment}
                    onChangeText={(txt) => setComment(txt)}
                    style={styles.input} />
                <TouchableOpacity style={[styles.postBtn,
                { backgroundColor: comment == '' ? '#9e9e9e' : Colors.THEME_COLOR }]}
                    disabled={comment == '' ? true : false}
                    onPress={() => {
                        postComment();
                    }}
                >
                    <Text>Comment</Text>
                </TouchableOpacity>
            </View>
            <Loader visible={loading} />
            <CommenOptionModal visible={openCommentOption}
                onClose={() => {
                    setOpenCommentOption(false);
                }}
                onClick={(x) => {
                    // Handle the click action if needed
                    setOpenCommentOption(false);
                    if (x == 2) {
                        deleteComment();
                    } else {
                        setNewComment(selectedItem.comment);
                        setOpenUpdateCommentModal(true);
                    }
                }}
            />
            <Modal transparent visible={openUpdateCommentModal}>
                <View style={styles.modalView}>
                    <View style={styles.mainView}>
                        <Text style={{
                            color: '#000', fontSize: 16, alignSelf: 'center', marginTop: 20
                        }}>
                            Edit Comment
                        </Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder='type comment here...'
                            placeholderTextColor={'#000'}
                            value={newComment}
                            onChangeText={txt => setNewComment(txt)}
                        />
                        <View style={styles.commentBottomView}>
                            <TouchableOpacity style={styles.cancelBtn}
                                onPress={() => {
                                    setOpenUpdateCommentModal(false);
                                }}>
                                <Text style={styles.btnText}>{'Cancel'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn}
                                onPress={() => {
                                    setOpenUpdateCommentModal(false);
                                    updateComment();
                                }}
                            >
                                <Text style={styles.btnText}>{'Update'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Loader visible={loading} />
        </View >
    )
}

export default Comments

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomView: {
        width: '100%',
        height: 70,
        backgroundColor: Colors.BG_COLOR,
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    input: {
        width: '70%',
        height: '100%',
        color: '#000'
    },
    postBtn: {
        width: '25%',
        height: '60%',
        backgroundColor: Colors.THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    btnTxt: {
        color: '#fff',
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainView: {
        width: '90%',
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    commentInput: {
        width: '90%',
        height: 50,
        paddingLeft: 20,
        borderWidth: .4,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10,
        color: '#000'
    },
    commentBottomView: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20
    },
    cancelBtn: {
        width: '40%',
        height: 45,
        borderRadius: 10,
        backgroundColor: '#9e9e9e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
    },
    saveBtn: {
        width: '40%',
        height: 45,
        borderRadius: 10,
        backgroundColor: Colors.THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
    }
})