import { View, Text } from 'react-native'
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Main from '../screens/Main';
import AddPost from '../screens/AddPost';
import Comments from '../screens/Comments';
import EditProfile from '../screens/EditProfile';
import UserProfile from '../screens/UserProfile';

const Stack = createStackNavigator();

const MainNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Splash' component={Splash} />
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Signup' component={Signup} />
                <Stack.Screen name='Main' component={Main} />
                <Stack.Screen name='AddPost' component={AddPost}
                    options={{ headerShown: true }}
                />
                <Stack.Screen name='Comments' component={Comments}
                    options={{ headerShown: true }}
                />
                <Stack.Screen name='EditProfile' component={EditProfile}
                    options={{ headerShown: true }}
                />
                <Stack.Screen name='UserProfile' component={UserProfile}
                    options={{ headerShown: true }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigator