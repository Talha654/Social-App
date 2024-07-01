import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../utils/Colors'
import { useNavigation } from '@react-navigation/native'
import Feed from './tabs/Feed'
import MyProfile from './tabs/MyProfile'

const Main = () => {

    const navigation = useNavigation();

    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Social</Text>
            {selectedTab == 0 ? < Feed /> : <MyProfile />}

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.bottomTab}
                    onPress={() => {
                        setSelectedTab(0);
                    }}
                >
                    <Image source={selectedTab == 0 ? require('../images/home-fill.png') :
                        require('../images/home-outline.png')

                    }
                        style={styles.tabIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addBtn}
                    onPress={() => {
                        navigation.navigate('AddPost');
                    }}
                >
                    <Image source={require('../images/add.png')}
                        style={[styles.tabIcon, { tintColor: '#fff' }]}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomTab,
                { tintColor: selectedTab == 1 ? Colors.THEME_COLOR : null }]}
                    onPress={() => {
                        setSelectedTab(1);
                    }}
                >
                    <Image source={selectedTab == 1 ? require('../images/user-fill.png') :
                        require('../images/user-outline.png')
                    }
                        style={styles.tabIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    title: {
        color: Colors.THEME_COLOR,
        fontWeight: '700',
        fontSize: 30,
        marginLeft: 20,
        marginBottom: 10
    },
    bottomNav: {
        width: '100%',
        height: 70,
        backgroundColor: "#f2f2f2",
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    bottomTab: {
        width: '25%',
        height: '100%',
        justifyContent: 'center',
        alignItems: "center"
    },
    tabIcon: {
        width: 34,
        height: 34,
    },
    addBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    }
})