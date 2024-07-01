import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { timeDifference } from './FeedItem'
import { useSelector } from 'react-redux'

const CommentItem = ({ data, onClickOption }) => {
    const authData = useSelector(state => state.auth);
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Image source={require('../images/person.png')}
                        style={{ width: 40, height: 40 }}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: '#000', fontSize: 17, fontWeight: '600' }}>
                            {data.username}
                        </Text>
                        <Text style={{ color: '#000', fontSize: 12 }}>
                            {timeDifference(new Date(data.createdAt))}
                        </Text>

                    </View>

                </View>
                {

                    authData.data.data._id == data.userId &&
                    <TouchableOpacity
                        onPress={() => onClickOption()}>
                        <Image source={require('../images/dot.png')}
                            style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>
                }

            </View>
            <Text style={{
                color: '#000', width: '90%',
                fontSize: 17, fontWeight: '400',
                marginTop: 10, alignSelf: 'center'
            }}>
                {data.comment}
            </Text>
        </View>
    )
}

export default CommentItem

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 100,
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 10
    }
})